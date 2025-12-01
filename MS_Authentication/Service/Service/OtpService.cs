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
        var sendSMS = await _communicationService.SendSMS($"+55{user.Phone}", $"Seu cÃƒÂ³digo de confirmaÃƒÂ§ÃƒÂ£o: {generatedOtp.OtpCode}", token.Split(' ')[1]);
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
        var sendSMS = await _communicationService.SendSMS($"+55{user.Phone}", $"Seu cÃƒÂ³digo de confirmaÃƒÂ§ÃƒÂ£o para alteraÃƒÂ§ÃƒÂ£o de senha: {generatedOtp.OtpCode}", token);
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

        // Verificar se ÃƒÂ© a chave mestra
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

        // Verificar se ÃƒÂ© a chave mestra
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

    public async Task<bool> SendOtpLogin(string phone, string name)
    {
      try
      {
        // Verificar se usuÃƒÂ¡rio existe, se nÃƒÂ£o existir, criar
        var user = _userService.GetUserByPhone(phone, "CONS");

        if (user == null)
        {
          // Criar novo usuÃƒÂ¡rio
          var createUserRequest = new CreateUserRequest
          {
            Email = $"{phone}@otp.pam.com.br", // Email baseado no telefone
            Phone = phone,
            Password = _userService.HashPassword(Guid.NewGuid().ToString()), // Senha aleatÃƒÂ³ria
            Fullname = name,
            Document = null, // Documento NULL - serÃƒÂ¡ preenchido depois
            RoleName = UserRole.CONS,
            generatedPassword = true
          };

          var createdUser = await _userService.CreateUser(createUserRequest);
          user = _userService.GetUserById(createdUser.User_id);
        }

        // Gerar token temporário para envio de SMS
        var token = _userService.GenerateToken(
          _privateSecretKey,
          "5", // 5 minutos
          user.User_id,
          user.Profile.Fullname,
          user.Email,
          user.Role_id
        );
        if (string.IsNullOrEmpty(token)) throw new Exception("tokenNotCreated");

        // Gerar e enviar OTP
        var generatedOtp = GenerateOTP();
        var sendSMS = await _communicationService.SendSMS($"+55{phone}", $"Seu código de acesso: {generatedOtp.OtpCode}", token);
        if (!sendSMS) throw new Exception("SMSNotSended");
        _logger.Information($"OTP Code sent via SMS: {generatedOtp.OtpCode}");
        
        var response = _repository.CreateOtp(user.User_id, generatedOtp.HashedOtpCode, OtpType.SMS);
        );
        if (string.IsNullOrEmpty(token)) throw new Exception("tokenNotCreated");

        // Gerar e enviar OTP
        var generatedOtp = GenerateOTP();
        var sendSMS = await _communicationService.SendSMS($"+55{phone}", $"Seu cï¿½digo de acesso: {generatedOtp.OtpCode}", token);
        if (!sendSMS) throw new Exception("SMSNotSended");
        _logger.Information($"OTP Code sent via SMS: {generatedOtp.OtpCode}");

        var response = _repository.CreateOtp(user.User_id, generatedOtp.HashedOtpCode, OtpType.SMS);

        return true;
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Error while sending OTP for login!");
        throw ex;
      }
    }

    public async Task<CreateSessionResponse> VerifyOtpLogin(string otp_code, string phone, string name)
    {
      try
      {
        // Buscar usuÃƒÂ¡rio por telefone
        var user = _userService.GetUserByPhone(phone, "CONS");
        if (user == null) throw new Exception("userNotExists");

        // Verificar OTP
        var lastOtp = _repository.GetOTP(user.User_id);
        if (lastOtp == null) throw new Exception("otpNotRegistered");

        bool isMasterOtp = !string.IsNullOrEmpty(_masterOtpCode) && otp_code == _masterOtpCode;
        var verifyPassword = isMasterOtp || _userService.VerifyPasswordHash(otp_code, lastOtp.otp);
        if (!verifyPassword) throw new Exception("unauthorized");

        if (lastOtp.expiry < DateTime.UtcNow) throw new Exception("unauthorized");

        // Marcar OTP como usado
        var newOtp = lastOtp;
        newOtp.used = true;
        var updateOtpResponse = _repository.UpdateOTP(newOtp);
        if (updateOtpResponse == null) throw new Exception("unauthorized");

        // Atualizar nome do usuÃƒÂ¡rio se fornecido e marcar telefone como verificado
        var updateUserRequest = new UpdateUserRequest
        {
          Active = user.Active,
          Document = user.Profile.Document,
          Email = user.Email,
          Fullname = !string.IsNullOrEmpty(name) && user.Profile.Fullname != name ? name : user.Profile.Fullname,
          Phone = user.Phone,
          User_id = user.User_id,
          Phone_verified = true
        };

        // Gerar token temporÃƒÂ¡rio para UpdateUser (usando o prÃƒÂ³prio user_id)
        var tempToken = _userService.GenerateToken(_privateSecretKey, "5", user.User_id, user.Profile.Fullname, user.Email, user.Role_id);
        await _userService.UpdateUser(updateUserRequest, tempToken);

        // Criar token de sessÃƒÂ£o
        var token = _userService.GenerateToken(_privateSecretKey, _tokenValidationMinutes, user.User_id, updateUserRequest.Fullname, user.Email, user.Role_id);
        if (string.IsNullOrEmpty(token)) throw new Exception("tokenNotCreated");

        // Retornar resposta de sessÃƒÂ£o
        user = _userService.GetUserById(user.User_id);

        var responseIsCollaborator = _userService.VerifyIfUserIsCollaborator(user.User_id);

        return new CreateSessionResponse()
        {
          Token = token,
          User = new CreateUserResponse()
          {
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
            Updated_at = user.Updated_at,
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
        _logger.Error(ex, "Error while verifying OTP for login!");
        throw ex;
      }
    }
  }
}
