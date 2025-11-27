using System;
using Domain.Model;
using Serilog;
using Infrastructure.Repository;
using System.Threading.Tasks;

namespace Application.Service
{
  public class OtpService : IOtpService
  {
    public readonly IUserService _userService;
    public readonly ICommunicationService _communicationService;
    public readonly IOtpRepository _repository;
    private readonly string _privateSecretKey;
    private readonly string _tokenValidationMinutes;
    private readonly string _masterOtpCode;
    private readonly ILogger _logger;
    public OtpService(
      IUserService userService,
      ICommunicationService communicationService,
      IOtpRepository repository,
      string privateSecretKey,
      string tokenValidationMinutes,
      string masterOtpCode,
      ILogger logger
    )
    {
      _repository = repository;
      _userService = userService;
      _communicationService = communicationService;
      _privateSecretKey = privateSecretKey;
      _tokenValidationMinutes = tokenValidationMinutes;
      _masterOtpCode = masterOtpCode;
      _logger = logger;
    }

    public OneTimePassword GenerateOTP()
    {
      string otp = "";
      Random random = new Random();
        for (int i = 0; i < 6; i++)
          otp += random.Next(0,9);
      return new OneTimePassword() {
        OtpCode = otp,
        HashedOtpCode = _userService.HashPassword(otp)
      };
    }

    public async Task<bool> SendOtpConfirmation(string token) {
      try
      {
        var decodedToken = _userService.GetDecodeToken(token.Split(' ')[1], _privateSecretKey);
        var user = _userService.GetUserById(decodedToken.UserId);

        var generatedOtp = GenerateOTP();
        var sendSMS = await _communicationService.SendSMS($"+55{user.Phone}", $"Seu código de confirmação: {generatedOtp.OtpCode}", token.Split(' ')[1]);
        if (!sendSMS) throw new Exception("SMSNotSended");
        
        var response = _repository.CreateOtp(user.User_id, generatedOtp.HashedOtpCode, OtpType.SMS);
        if (response == null) throw new Exception("createOtpNotSuccefully");

        return true;
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Error while send otp to user!");
        throw ex;
      }
    }

    public async Task<bool> SendOtpForgotPassword(string phone_number)
    {
      try
      {
        var user = _userService.GetUserByPhone(phone_number, UserRole.CONS.ToString());
        if (user == null) throw new Exception("userNotExists");

        var token = _userService.GenerateToken(
          _privateSecretKey,
          _tokenValidationMinutes,
          user.User_id,
          user.Profile.Fullname,
          user.Email,
          user.Role_id
        );
        if (string.IsNullOrEmpty(token)) throw new Exception("tokenNotCreated");

        var generatedOtp = GenerateOTP();
        var sendSMS = await _communicationService.SendSMS($"+55{user.Phone}", $"Seu código de confirmação para alteração de senha: {generatedOtp.OtpCode}", token);
        if (!sendSMS) throw new Exception("SMSNotSended");
        
        var response = _repository.CreateOtp(user.User_id, generatedOtp.HashedOtpCode, OtpType.SMS);
        if (response == null) throw new Exception("createOtpNotSuccefully");

        return true;
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Error while send otp to user!");
        throw ex;
      }
    }

    public Task<bool> VerifyOtpCode(string otp_code, string token)
    {
      try
      {
        var decodedToken = _userService.GetDecodeToken(token.Split(' ')[1], _privateSecretKey);

        var user = _userService.GetUserById(decodedToken.UserId);
        if (user == null) throw new Exception("userNotExists");

        // Verificar se é a chave mestra
        if (!string.IsNullOrEmpty(_masterOtpCode) && otp_code == _masterOtpCode)
        {
          _logger.Information($"[OtpService] - Master OTP code used for user {user.User_id}");

          var updateUser = new UpdateUserRequest() {
            Active = user.Active,
            Document = user.Profile.Document,
            Email = user.Email,
            Fullname = user.Profile.Fullname,
            Phone = user.Phone,
            User_id = user.User_id,
            Phone_verified = true
          };
          var responseUpdateUser = _userService.UpdateUser(updateUser, token);
          if (responseUpdateUser == null) throw new Exception("otpNotRegistered");

          return Task.FromResult(true);
        }

        var lastOtp = _repository.GetOTP(user.User_id);
        if (lastOtp == null) throw new Exception("otpNotRegistered");

        var verifyPassword = _userService.VerifyPasswordHash(otp_code, lastOtp.otp);
        if (!verifyPassword) throw new Exception("unauthorized");

        if (lastOtp.expiry < DateTime.UtcNow) throw new Exception("unauthorized");

        var newOtp = lastOtp;
        newOtp.used = true;

        var response = _repository.UpdateOTP(newOtp);
        if (response == null) throw new Exception("unauthorized");

        var updateUserNormal = new UpdateUserRequest() {
          Active = user.Active,
          Document = user.Profile.Document,
          Email = user.Email,
          Fullname = user.Profile.Fullname,
          Phone = user.Phone,
          User_id = user.User_id,
          Phone_verified = true
        };
        var responseUpdateUserNormal = _userService.UpdateUser(updateUserNormal, token);
        if (responseUpdateUserNormal == null) throw new Exception("otpNotRegistered");

        return Task.FromResult(true);

      }
      catch (Exception ex) {
        throw ex;
      }
    }

    public Task<CreateSessionResponse> VerifyOtpCodeForgotPassword(string otp_code, string phone_number)
    {
      try
      {

        var user = _userService.GetUserByPhone(phone_number, UserRole.CONS.ToString());
        if (user == null) throw new Exception("userNotExists");

        var token = _userService.GenerateToken(
          _privateSecretKey,
          _tokenValidationMinutes,
          user.User_id,
          user.Profile.Fullname,
          user.Email,
          user.Role_id
        );
        if (string.IsNullOrEmpty(token)) throw new Exception("tokenNotCreated");

        // Verificar se é a chave mestra
        if (!string.IsNullOrEmpty(_masterOtpCode) && otp_code == _masterOtpCode)
        {
          _logger.Information($"[OtpService] - Master OTP code used for forgot password - user {user.User_id}");

          var updateUserMaster = new UpdateUserRequest() {
            Active = user.Active,
            Document = user.Profile.Document,
            Email = user.Email,
            Fullname = user.Profile.Fullname,
            Phone = user.Phone,
            User_id = user.User_id,
            Phone_verified = true
          };
          var responseUpdateUserMaster = _userService.UpdateUser(updateUserMaster, token);
          if (responseUpdateUserMaster == null) throw new Exception("otpNotRegistered");

          user = _userService.GetUserById(user.User_id);

          return Task.FromResult(
            new CreateSessionResponse()
              {
                Token = token,
                User = new CreateUserResponse() {
                  Profile = user.Profile,
                  Active = user.Active,
                  Created_at = user.Created_at,
                  Deleted_at = user.Deleted_at,
                  Email = user.Email,
                  Last_login = user.Last_login,
                  Password_generated = user.Password_generated,
                  Phone = user.Phone,
                  Role = user.Role,
                  Role_id = user.Role_id,
                  Updated_at = user.Deleted_at,
                  User_id = user.User_id,
                  Phone_verified = user.Phone_verified
                }
              }
          );
        }

        var lastOtp = _repository.GetOTP(user.User_id);
        if (lastOtp == null) throw new Exception("otpNotRegistered");

        var verifyPassword = _userService.VerifyPasswordHash(otp_code, lastOtp.otp);
        if (!verifyPassword) throw new Exception("unauthorized");

        if (lastOtp.expiry < DateTime.UtcNow) throw new Exception("unauthorized");

        var newOtp = lastOtp;
        newOtp.used = true;

        var response = _repository.UpdateOTP(newOtp);
        if (response == null) throw new Exception("unauthorized");

        var updateUser = new UpdateUserRequest() {
          Active = user.Active,
          Document = user.Profile.Document,
          Email = user.Email,
          Fullname = user.Profile.Fullname,
          Phone = user.Phone,
          User_id = user.User_id,
          Phone_verified = true
        };
        var responseUpdateUser = _userService.UpdateUser(updateUser, token);
        if (responseUpdateUser == null) throw new Exception("otpNotRegistered");

        user = _userService.GetUserById(user.User_id);

        return Task.FromResult(
          new CreateSessionResponse()
            {
              Token = token,
              User = new CreateUserResponse() {
                Profile = user.Profile,
                Active = user.Active,
                Created_at = user.Created_at,
                Deleted_at = user.Deleted_at,
                Email = user.Email,
                Last_login = user.Last_login,
                Password_generated = user.Password_generated,
                Phone = user.Phone,
                Role = user.Role,
                Role_id = user.Role_id,
                Updated_at = user.Deleted_at,
                User_id = user.User_id,
                Phone_verified = user.Phone_verified
              }
            }
        );

      }
      catch (Exception ex) {
        throw ex;
      }
    }
  }
}
