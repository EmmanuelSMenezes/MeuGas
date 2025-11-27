using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Policy;
using Domain.Model;
using Infrastructure.Repository;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics.Metrics;

namespace Application.Service
{
    public class SettingsService : ISettingsService
    {
        public readonly ISettingsRepository _settingsRepository;
        private readonly ILogger _logger;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;
        private readonly HttpEndPoints _httpEndPoints;
        private readonly IHubContext<StyleHub> _hubContext;

        public SettingsService(
          IHubContext<StyleHub> hubContext,
          HttpEndPoints httpEndPoints,
          ISettingsRepository settingsRepository,
          ILogger logger,
          string privateSecretKey,
          string tokenValidationMinutes
        )
        {
            _hubContext = hubContext;
            _httpEndPoints = httpEndPoints;
            _settingsRepository = settingsRepository;
            _logger = logger;
            _privateSecretKey = privateSecretKey;
            _tokenValidationMinutes = tokenValidationMinutes;
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
     
        public RateSettingsResponse CreatedRateSettingsService(CreatedRateSettingsRequest createRateSettingsRequest, string token)
        {
            try
            {
                var rate = _settingsRepository.GetRateSettingsAdminRepository(createRateSettingsRequest.Admin_id);
                if (rate != null) throw new Exception("ExistingRate");


                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey) ?? throw new Exception("ErrorDecodingToken");
                createRateSettingsRequest.Created_by = decodedToken.UserId;

                var response = _settingsRepository.CreatedRateSettingsRepository(createRateSettingsRequest);
                return response;

            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"[SettingsService - CreateSettingsService]: Error while creating rate settings.");
                throw;
            }
        }

        public RateSettingsResponse GetRateSettingsAdminService(Guid admin_id)
        {
            try
            {
                var response = _settingsRepository.GetRateSettingsAdminRepository(admin_id);
                _logger.Information("[SettingsService - GetRateSettingsAdminService]: Rate settings retrieved successfully.");
                return response;
            }
            catch (Exception ex)
            {

                _logger.Error(ex, $"[SettingsService - GetRateSettingsAdminService]: Error while retrieved rate settings.");
                throw;
            }
        }

        public RateSettingsResponse UpdatedRateSettingsService(UpdatedRateSettingsRequest updatedRateSettingsRequest, string token)
        {
            try
            {

                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey) ?? throw new Exception("ErrorDecodingToken");
                updatedRateSettingsRequest.Updated_by = decodedToken.UserId;

                var response = _settingsRepository.UpdatedRateSettingsRepository(updatedRateSettingsRequest);
                return response;

            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"[SettingsService - UpdatedSettingsService]: Error while updating rate settings.");
                throw;
            }
        }

        public async Task<StylePartnerResponse> CreateStylePartnerService(CreateStyleRequest stylePartnerRequest, string token)
        {
            try
            {
                var style = _settingsRepository.GetStylePartnerRepository(stylePartnerRequest.Admin_id);
                if (style != null) throw new Exception("ExistingStyle");
                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey) ?? throw new Exception("ErrorDecodingToken");
                stylePartnerRequest.Created_by = decodedToken.UserId;

                if (stylePartnerRequest.Logo != null)
                {

                    var requestLogo = new UploadLogoRequest()
                    {
                        File = stylePartnerRequest.Logo
                    };

                    HttpContent intContent = new StringContent(requestLogo.bucketId.ToString());
                    var fileStream = requestLogo.File.OpenReadStream();


                    using (var httpClient = new HttpClient())
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Split(' ')[1]);
                        using (var form = new MultipartFormDataContent())
                        {
                            form.Add(intContent, "bucketId");
                            form.Add(new StreamContent(fileStream), "File", requestLogo.File.FileName);

                            var req = await httpClient.PostAsync($"{_httpEndPoints.MSStorageBaseUrl}storage/upload", form);
                            var responseString = await req.Content.ReadAsStringAsync();
                            var responseUrl = JsonConvert.DeserializeObject<HttpResponse<UploadLogoResponse>>(responseString);

                            if (!responseUrl.data.isUploaded)
                            {
                                throw new Exception("failedWhileUpdateImage");
                            }
                            stylePartnerRequest.Url = responseUrl.data.Url;
                        }
                    }
                }
                var stylePartner = _settingsRepository.CreateStylePartnerRepository(stylePartnerRequest);
                if (stylePartner == null) throw new Exception("NotCreateStyleWeb");

                _logger.Information("[SettingsService - CreateStylePartnerService]: Style Web create successfully.");

                var styleConsumer = _settingsRepository.CreateStyleConsumerRepository(stylePartnerRequest);
                if (styleConsumer == null) throw new Exception("NotCreateStyleApp");

                _logger.Information("[SettingsService - CreateStylePartnerService]: Style App create successfully.");

                await _hubContext.Clients.Group(stylePartner.Admin_id.ToString()).SendAsync("RefreshStyle", JsonConvert.SerializeObject(stylePartner), JsonConvert.SerializeObject(styleConsumer));
                _logger.Information("[SettingsService - CreateStylePartnerService]: Style SignalR Send successfully.");

                return stylePartner;

            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"[SettingsService - CreateStylePartnerService]: Error while updating rate settings.");
                throw;
            }
        }

        public StylePartnerResponse GetStylePartnerService(Guid admin_id)
        {
            try
            {
                var response = _settingsRepository.GetStylePartnerRepository(admin_id);
                _logger.Information("[SettingsService - GetStylePartnerService]: Style settings retrieved successfully.");
                return response;
            }
            catch (Exception ex)
            {

                _logger.Error(ex, $"[SettingsService - GetStylePartnerService]: Error while retrieved style settings.");
                throw;
            }
        }

        public async Task<StylePartnerResponse> UpdateStylePartnerService(UpdateStyleRequest stylePartnerRequest, string token)
        {
            try
            {
               
                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey) ?? throw new Exception("ErrorDecodingToken");
                stylePartnerRequest.Updated_by = decodedToken.UserId;

                if (stylePartnerRequest.Logo != null)
                {

                    var requestLogo = new UploadLogoRequest()
                    {
                        File = stylePartnerRequest.Logo
                    };

                    HttpContent intContent = new StringContent(requestLogo.bucketId.ToString());
                    var fileStream = requestLogo.File.OpenReadStream();


                    using (var httpClient = new HttpClient())
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Split(' ')[1]);
                        using (var form = new MultipartFormDataContent())
                        {
                            form.Add(intContent, "bucketId");
                            form.Add(new StreamContent(fileStream), "File", requestLogo.File.FileName);

                            var req = await httpClient.PostAsync($"{_httpEndPoints.MSStorageBaseUrl}storage/upload", form);
                            var responseString = await req.Content.ReadAsStringAsync();
                            var responseUrl = JsonConvert.DeserializeObject<HttpResponse<UploadLogoResponse>>(responseString);

                            if (!responseUrl.data.isUploaded)
                            {
                                throw new Exception("failedWhileUpdateImage");
                            }
                            stylePartnerRequest.Url = responseUrl.data.Url;
                        }
                    }
                }
                var stylePartner = _settingsRepository.UpdateStylePartnerRepository(stylePartnerRequest);
                if (stylePartner == null) throw new Exception("NotUpdateStyleWeb");
                _logger.Information("[SettingsService - UpdateStylePartnerService]: Style update successfully.");

                var styleConsumer = _settingsRepository.UpdateStyleConsumerRepository(stylePartnerRequest);
                if (styleConsumer == null) throw new Exception("NotUpdateStyleApp");

                _logger.Information("[SettingsService - CreateStylePartnerService]: Style App create successfully.");


                await _hubContext.Clients.Group(stylePartner.Admin_id.ToString()).SendAsync("RefreshStyle", JsonConvert.SerializeObject(stylePartner), JsonConvert.SerializeObject(styleConsumer));
                _logger.Information("[SettingsService - UpdateStylePartnerService]: Style SignalR Send successfully.");

                return stylePartner;

            }
            catch (Exception ex)
            {
                _logger.Error(ex, $"[SettingsService - UpdateStylePartnerService]: Error while updating rate settings.");
                throw;
            }
        }

        public StyleConsumerResponse GetStyleConsumerService()
        {
            try
            {
                var response = _settingsRepository.GetStyleConsumerRepository();
                _logger.Information("[SettingsService - GetStyleConsumerService]: Style App settings retrieved successfully.");
                return response;
            }
            catch (Exception ex)
            {

                _logger.Error(ex, $"[SettingsService - GetStyleConsumerService]: Error while retrieved style app settings.");
                throw;
            }
        }
    }
}
