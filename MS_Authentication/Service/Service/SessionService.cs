using System;
using Domain.Model;
using Serilog;

namespace Application.Service
{
  public class SessionService : ISessionService
  {
    public readonly IUserService _userService;
    private readonly ILogger _logger;
    private readonly string _privateSecretKey;
    private readonly string _tokenValidationMinutes;
    private readonly EmailSettings _emailSettings;
    public SessionService(
      IUserService userService,
      ILogger logger,
      string privateSecretKey,
      string tokenValidationMinutes,
      EmailSettings emailSettings
    )
    {
      _userService = userService;
      _logger = logger;
      _privateSecretKey = privateSecretKey;
      _tokenValidationMinutes = tokenValidationMinutes;
      _emailSettings = emailSettings;
    }
    public CreateSessionResponse CreateSessionService(CreateSessionRequest createSessionRequest)
    {
      try
      {
        User user = new User();
        if (string.IsNullOrEmpty(createSessionRequest.Phone) && (createSessionRequest.RoleName == UserRole.ADM || createSessionRequest.RoleName == UserRole.PART)) {
          user = _userService.GetUserByEmail(createSessionRequest.Email, createSessionRequest.RoleName.ToString());
          if (user == null)
          {
            throw new Exception("userNotExists");
          }
        } else if (createSessionRequest.RoleName == UserRole.CONS && string.IsNullOrEmpty(createSessionRequest.Email)) {
          user = _userService.GetUserByPhone(createSessionRequest.Phone, createSessionRequest.RoleName.ToString());
          if (user == null)
          {
            throw new Exception("userNotExists");
          }
        } else if (createSessionRequest.RoleName == UserRole.CONS && string.IsNullOrEmpty(createSessionRequest.Phone)) {
          user = _userService.GetUserByEmail(createSessionRequest.Email, createSessionRequest.RoleName.ToString());
          if (user == null)
          {
            throw new Exception("userNotExists");
          }
        }
        
        if (user.Password == null) throw new Exception("userNotExists");
        var passwordVerified = _userService.VerifyPasswordHash(createSessionRequest.Password, user.Password);
        if (!passwordVerified)
        {
          throw new Exception("incorrectPassword");
        }

        var responseIsCollaborator = _userService.VerifyIfUserIsCollaborator(user.User_id);

        return new CreateSessionResponse()
        {
          Token = _userService.GenerateToken(_privateSecretKey, _tokenValidationMinutes, user.User_id, user.Profile.Fullname, user.Email, user.Role_id),
          User = new CreateUserResponse() {
            Profile = user.Profile,
            Active = user.Active,
            Created_at = user.Created_at,
            Deleted_at = user.Deleted_at,
            Email = user.Email,
            Last_login = user.Last_login,
            Admin_id = user.Admin_id,
            Password_generated = user.Password_generated,
            Phone = user.Phone,
            Role = user.Role,
            Role_id = user.Role_id,
            Updated_at = user.Deleted_at,
            User_id = user.User_id,
            Phone_verified = user.Phone_verified,
            IsActiveCollaborator = responseIsCollaborator.IsActiveCollaborator,
            IsCollaborator = responseIsCollaborator.IsCollaborator,
            Sponsor_id = responseIsCollaborator.Sponsor_id
          }
        };
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }
  }
}
