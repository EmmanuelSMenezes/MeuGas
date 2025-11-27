using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Domain.Model;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Serilog;

namespace Application.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly ILogger _logger;
        private readonly EmailSettings _emailSettings;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;
        private readonly BaseURLWebApplication _baseURLWebApplication;
        private readonly HttpEndPoints _httpEndPoints;
        private readonly ICommunicationService _communicationService;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly ICollaboratorRepository _collaboratorRepository;

        public UserService(
          IUserRepository repository,
          ILogger logger,
          EmailSettings emailSettings,
          string privateSecretKey,
          string tokenValidationMinutes,
          BaseURLWebApplication baseURLWebApplication,
          HttpEndPoints httpEndPoints,
          ICommunicationService communicationService,
          IEmailTemplateService emailTemplateService,
          ICollaboratorRepository collaboratorRepository
          )
        {
            _repository = repository;
            _logger = logger;
            _emailSettings = emailSettings;
            _privateSecretKey = privateSecretKey;
            _tokenValidationMinutes = tokenValidationMinutes;
            _baseURLWebApplication = baseURLWebApplication;
            _httpEndPoints = httpEndPoints;
            _communicationService = communicationService;
            _emailTemplateService = emailTemplateService;
            _collaboratorRepository = collaboratorRepository;
        }

        public User GetUserById(Guid user_id)
        {
            try
            {
                if (user_id == Guid.Empty) throw new ArgumentException("user_id is required");
                return _repository.GetUserById(user_id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public User GetUserByEmail(String email, string role_name)
        {
            try
            {
                if (String.IsNullOrEmpty(email)) throw new ArgumentException("email is required");
                if (String.IsNullOrEmpty(role_name)) throw new ArgumentException("role_name is required");
                var user = _repository.GetUserByEmail(email, role_name);
                return user;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public User GetUserByPhone(String phone, string role_name)
        {
            try
            {
                if (String.IsNullOrEmpty(phone)) throw new ArgumentException("phone is required");
                if (String.IsNullOrEmpty(role_name)) throw new ArgumentException("role_name is required");
                return _repository.GetUserByPhone(phone, role_name);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool VerifyPasswordHash(string password, string hashedPassword)
        {
            var passwordVerificationResult = new PasswordHasher<object?>().VerifyHashedPassword(null, hashedPassword, password);
            switch (passwordVerificationResult)
            {
                case PasswordVerificationResult.Failed:
                    return false;
                case PasswordVerificationResult.Success:
                    return true;
                default:
                    return false;
            }
        }

        public string HashPassword(string password)
        {
            return new PasswordHasher<object?>().HashPassword(null, password);
        }

        public string GenerateToken(string secretKey, string expiresIn, Guid userId, string name, string email, Guid roleId)
        {
            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            byte[] bytes = Encoding.ASCII.GetBytes(secretKey);
            SecurityTokenDescriptor securityTokenDescriptor = new SecurityTokenDescriptor();
            securityTokenDescriptor.Subject = new ClaimsIdentity(new Claim[4]
            {
            new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", email),
            new Claim("name", name),
            new Claim("userId", userId.ToString()),
            new Claim("roleId", roleId.ToString())
            });
            securityTokenDescriptor.Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(expiresIn));
            securityTokenDescriptor.SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(bytes), "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256");
            SecurityTokenDescriptor tokenDescriptor = securityTokenDescriptor;
            SecurityToken token = jwtSecurityTokenHandler.CreateToken(tokenDescriptor);
            return jwtSecurityTokenHandler.WriteToken(token);
        }

        public DecodedToken GetDecodeToken(string token, string secret)
        {
            DecodedToken decodedToken = new DecodedToken();
            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtSecurityToken = jwtSecurityTokenHandler.ReadToken(token) as JwtSecurityToken;
            if (IsValidToken(token, secret))
            {
                foreach (Claim claim in jwtSecurityToken.Claims)
                {
                    if (claim.Type == "email")
                    {
                        decodedToken.email = claim.Value;
                    }
                    else if (claim.Type == "name")
                    {
                        decodedToken.name = claim.Value;
                    }
                    else if (claim.Type == "userId")
                    {
                        decodedToken.UserId = new Guid(claim.Value);
                    }
                    else if (claim.Type == "roleId")
                    {
                        decodedToken.RoleId = new Guid(claim.Value);
                    }
                }

                return decodedToken;
            }

            throw new Exception("invalidToken");
        }
        public bool IsValidToken(string token, string secret)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new Exception("emptyToken");
            }
            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            TokenValidationParameters tokenValidationParameters = new TokenValidationParameters();
            tokenValidationParameters.ValidateIssuer = false;
            tokenValidationParameters.ValidateAudience = false;
            tokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(Base64UrlEncoder.Encode(secret)));

            try
            {
                SecurityToken validatedToken;
                ClaimsPrincipal claimsPrincipal = jwtSecurityTokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public string GeneratePassword()
        {
            string chars = "!@#$%&*!@#$%&*abcdefghjkmnpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYXZ023456789!@#$%&*!@#$%&*!@#$%&*";
            string generatedPassword = "";
            Random random = new Random();
            for (int f = 0; f < 8; f++)
            {
                generatedPassword = generatedPassword + chars.Substring(random.Next(0, chars.Length - 1), 1);
            }
            return $"{generatedPassword}P@m1";
        }

        public async Task<CreateUserResponse> CreateUser(CreateUserRequest createUserRequest)
        {
            var generatedPassword = "";
            try
            {
                User user = GetUserByEmail(createUserRequest.Email, createUserRequest.RoleName.ToString());
                if (user != null) throw new Exception("userEmailAlreadyRegistered");


                user = GetUserByPhone(createUserRequest.Phone, createUserRequest.RoleName.ToString());


                if (user != null) throw new Exception("userPhoneAlreadyRegistered");


                if (!string.IsNullOrEmpty(createUserRequest.Password) && !createUserRequest.generatedPassword)
                {
                    createUserRequest.Password = HashPassword(createUserRequest.Password);
                    createUserRequest.generatedPassword = false;
                }
                else if (createUserRequest.generatedPassword && createUserRequest.RoleName.ToString() == UserRole.PART.ToString())
                {
                    generatedPassword = GeneratePassword();
                    createUserRequest.Password = HashPassword(generatedPassword);
                    createUserRequest.generatedPassword = true;
                }
                else
                {
                    createUserRequest.Password = HashPassword(createUserRequest.Password);
                    createUserRequest.generatedPassword = true;
                }

                var response = _repository.CreateUser(createUserRequest);

                if (response.Password_generated && response.Role.Tag == UserRole.PART.ToString())
                {
                    var emailTemplate = _emailTemplateService.FirstAccessPartner(
                    new FirstAccessPartner()
                    {
                        User_fullName = response.Profile.Fullname,
                        GeneratedPassword = generatedPassword,
                        User_Email = response.Email
                    }
                  );
                    var sendEmailStatus = await _communicationService.SendMail(
                      response.Email,
                      emailTemplate.Subject,
                      emailTemplate.Body,
                      GenerateToken(
                        _privateSecretKey,
                        _tokenValidationMinutes,
                        response.User_id,
                        response.Profile.Fullname,
                        response.Email,
                        response.Role_id
                      )
                    );

                    if (!sendEmailStatus)
                    {
                        throw new Exception("userRegisteredWithEmailNotSent");
                    }
                }

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> ForgotPassword(string email, UserRole userRole)
        {
            try
            {
                var response = GetUserByEmail(email, userRole.ToString());
                if (response == null) throw new Exception("userNotExists");

                var resetToken = GenerateToken(
                  _privateSecretKey,
                  _tokenValidationMinutes,
                  response.User_id,
                  response.Profile.Fullname,
                  response.Email,
                  response.Role_id
                );

                string baseUrlWebAppWithToken = "";
                string portalName = "";
                switch (response.Role.Tag)
                {
                    case "ADM":
                        baseUrlWebAppWithToken = $"{_baseURLWebApplication.Administrator}reset-password/{resetToken}";
                        portalName = "Administrador";
                        break;
                    case "PART":
                        baseUrlWebAppWithToken = $"{_baseURLWebApplication.Partner}reset-password/{resetToken}";
                        portalName = "Parceiro";
                        break;
                    case "CONS":
                        baseUrlWebAppWithToken = $"Mobile://{resetToken}";
                        portalName = "Consumidor";
                        break;
                    default:
                        throw new Exception("notPossibleIndetifyOriginOfUser");
                }

                var emailTemplate = _emailTemplateService.ForgotPassword(
                  new ForgotPassword()
                  {
                      BaseUrlWebAppWithToken = baseUrlWebAppWithToken,
                      PortalName = portalName,
                      User_fullName = response.Profile.Fullname
                  }
                );

                await _communicationService.SendMail(
                  response.Email,
                  emailTemplate.Subject,
                  emailTemplate.Body,
                  resetToken
                );

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> ResetPassword(RequestResetPassword requestResetPassword, string token)
        {
            try
            {
                if (requestResetPassword.password != requestResetPassword.passwordConfirmation)
                {
                    throw new Exception("passwordAndPasswordConfirmationNotMatch");
                }
                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey);
                requestResetPassword.Email = decodedToken.email;
                requestResetPassword.User_id = decodedToken.UserId;
                requestResetPassword.Role_id = decodedToken.RoleId;
                requestResetPassword.HashedPassword = HashPassword(requestResetPassword.password);

                var response = _repository.ResetPassword(requestResetPassword);
                if (response)
                {
                    await _communicationService.SendMail(
                      requestResetPassword.Email,
                      "PAM Platform - Segurança",
                      "Houve uma tentativa bem sucedida de reset de senha, caso não tenha sido você entre em contato com nossa plataforma.",
                      token.Split(' ')[1]
                    );
                    return response;
                }
                throw new Exception("errorUpdatePassword");
            }
            catch (Exception ex)
            {
                await _communicationService.SendMail(
                    requestResetPassword.Email,
                    "PAM Platform - Segurança",
                    "Houve uma tentativa mal sucedida de reset de senha, caso não tenha sido você entre em contato com nossa plataforma.",
                    token.Split(' ')[1]
                  );
                _logger.Error(ex, "[UserService - ResetPassword]: Erro while update user password");
                throw ex;
            }
        }

        public async Task<bool> ChangePassword(RequestChangePassword requestChangePassword, string token)
        {
            try
            {
                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey);

                var user = GetUserById(decodedToken.UserId);
                if (user == null) throw new Exception("userNotExists");

                requestChangePassword.Email = decodedToken.email;
                requestChangePassword.User_id = decodedToken.UserId;
                requestChangePassword.Role_id = decodedToken.RoleId;
                requestChangePassword.HashedPassword = HashPassword(requestChangePassword.Password);

                var passwordVerified = VerifyPasswordHash(requestChangePassword.Old_password, user.Password);
                if (!passwordVerified)
                {

                    await _communicationService.SendMail(
                    requestChangePassword.Email,
                    "PAM Platform - Segurança",
                    "Houve uma tentativa de alteração de senha, caso não tenha sido você entre em contato com nossa plataforma.",
                    token.Split(' ')[1]
                  );

                    throw new Exception("incorrectPassword");
                }

                if (requestChangePassword.Password != requestChangePassword.PasswordConfirmation)
                {
                    throw new Exception("passwordAndPasswordConfirmationNotMatch");
                }


                var response = _repository.ChangePassword(requestChangePassword);
                if (response)
                {
                    await _communicationService.SendMail(
                      requestChangePassword.Email,
                      "PAM Platform - Segurança",
                      "Houve uma tentativa bem sucedida de alteração de senha, caso não tenha sido você entre em contato com nossa plataforma.",
                      token.Split(' ')[1]
                    );
                    return response;
                }
                throw new Exception("errorUpdatePassword");
            }
            catch (Exception ex)
            {

                _logger.Error(ex, "[UserService - ChangePassword]: Erro while update user password");
                throw ex;
            }
        }

        public async Task<UpdateUserResponse> UpdateUser(UpdateUserRequest updateUserRequest, string token)
        {
            try
            {
                User user = GetUserById(updateUserRequest.User_id);
                user.Email = updateUserRequest.Email;
                user.Phone = updateUserRequest.Phone;
                if (updateUserRequest.Phone_verified != null)
                {
                    user.Phone_verified = (bool)updateUserRequest.Phone_verified;
                }
                user.Profile.Fullname = updateUserRequest.Fullname;
                user.Profile.Document = updateUserRequest.Document;
                if (updateUserRequest.Active == null)
                {
                    user.Active = true;
                }
                else
                {
                    user.Active = (bool)(updateUserRequest.Active);
                }
                if (updateUserRequest.Avatar != null)
                {
                    var requestAvatar = new UploadAvatarRequest()
                    {
                        File = updateUserRequest.Avatar
                    };
                    HttpContent intContent = new StringContent(requestAvatar.bucketId.ToString());
                    var fileStream = requestAvatar.File.OpenReadStream();
                    using (var httpClient = new HttpClient())
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Split(' ')[1]);
                        using (var form = new MultipartFormDataContent())
                        {
                            form.Add(intContent, "bucketId");
                            form.Add(new StreamContent(fileStream), "File", requestAvatar.File.FileName);

                            var req = await httpClient.PostAsync($"{_httpEndPoints.MSStorageBaseUrl}storage/upload", form);
                            var responseString = await req.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<HttpResponse<UploadAvatarResponse>>(responseString);

                            if (!response.data.isUploaded)
                            {
                                throw new Exception("failedWhileUpdateUser");
                            }
                            user.Profile.Avatar = response.data.Url;
                        }
                    }
                }
                var updatedUser = _repository.UpdateUser(user);

                var sponsor = VerifyIfUserIsCollaborator(updatedUser.User_id);
                if (sponsor != null)
                {
                    updatedUser.IsActiveCollaborator = sponsor.IsActiveCollaborator;
                    updatedUser.IsCollaborator = sponsor.IsCollaborator;
                    updatedUser.Sponsor_id = sponsor.Sponsor_id;
                }

                return updatedUser;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[UserService - UpdateUser]: Error while updating user.");
                throw ex;
            }
        }

        public bool DeleteUser(List<Guid> ids)
        {
            try
            {
                return _repository.DeleteUser(ids);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[UserService - DeleteUser]: Error while delete user.");
                throw ex;
            }
        }

        public CollaboratorStats VerifyIfUserIsCollaborator(Guid user_id)
        {
            try
            {
                var response = _collaboratorRepository.GetCollaboratorByUserId(user_id);
                return new CollaboratorStats()
                {
                    IsActiveCollaborator = response != null ? response.Active : false,
                    IsCollaborator = response != null ? true : false,
                    Sponsor_id = response != null ? response?.Sponsor_id : null
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
