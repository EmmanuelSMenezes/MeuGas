using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Model;

namespace Application.Service
{
  public interface IUserService
  {
    User GetUserById(Guid user_id);
    User GetUserByEmail(String email, string role_name);
    User GetUserByPhone(String phone, string role_name);
    Task<CreateUserResponse> CreateUser(CreateUserRequest createUserRequest);
    bool VerifyPasswordHash(string password, string hashedpassword);
    string HashPassword(string password);
    string GenerateToken(string secretKey, string expiresIn, Guid userId, string name, string email, Guid roleId);
    DecodedToken GetDecodeToken(string token, string secret);
    bool IsValidToken(string token, string secret);
    string GeneratePassword();
    Task<bool> ResetPassword(RequestResetPassword requestResetPassword, string token);
    Task<bool> ChangePassword(RequestChangePassword requestChangePassword, string token);
    Task<bool> ForgotPassword(string email, UserRole userRole);
    Task<UpdateUserResponse> UpdateUser(UpdateUserRequest updateUserRequest, string token);
    bool DeleteUser(List<Guid> ids);
    CollaboratorStats VerifyIfUserIsCollaborator(Guid user_id);
  }

}
public class CollaboratorStats
{
  public bool IsCollaborator { get; set; }
  public bool IsActiveCollaborator { get; set; }
  public Guid? Sponsor_id { get; set; }
}
