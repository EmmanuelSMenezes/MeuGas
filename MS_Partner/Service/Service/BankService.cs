using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Infrastructure.Repository;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace Application.Service
{
    public class BankService : IBankService
    {
        private readonly IBankRepository _repository;
        private readonly ILogger _logger;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;

        public BankService(IBankRepository repository,
            ILogger logger, string privateSecretKey, string tokenValidationMinutes)
        {
            _repository = repository;
            _logger = logger;
            _privateSecretKey = privateSecretKey;
            _tokenValidationMinutes = tokenValidationMinutes;
        }

        public BankPartner CreateBank(CreateBankRequest bankRequest, string token)
        {
            try
            {
                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey) ?? throw new Exception("ErrorDecodingToken");
                bankRequest.Created_by = decodedToken.UserId;
                return _repository.CreateBank(bankRequest);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Service - CreateBank]: Exception when creating bank details!");
                throw;
            }
        }

        public BankPartner DeleteBank(Guid bank_details_id)
        {
            try
            {

                return _repository.DeleteBank(bank_details_id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Service - DeleteBank]: Exception while deleting data!");
                throw;
            }
        }

        public BankPartner GetBankById(Guid partner_id)
        {
            try
            {               
                
                return _repository.GetBankById(partner_id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Service - GetBankById]: Exception while fetching data!");
                throw;
            }
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

        public BankPartner UpdateBank(UpdateBankRequest bankRequest, string token)
        {
            try
            {
                var decodedToken = GetDecodeToken(token.Split(' ')[1], _privateSecretKey) ?? throw new Exception("ErrorDecodingToken");
                bankRequest.Updated_by = decodedToken.UserId;
                return _repository.UpdateBank(bankRequest);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Service - UpdateBank]: Exception when updating bank details!");
                throw;
            }
        }
    }
}
