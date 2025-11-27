using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Service.Interfaces;
using Domain.Model;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Serilog;

namespace Application.Service
{
    public class ReputationProductService : IReputationProductService
    {
        private readonly IReputationProductRepository _repository;
        private readonly ILogger _logger;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;

        public ReputationProductService(
          IReputationProductRepository repository,
          ILogger logger,
          string privateSecretKey,
          string tokenValidationMinutes
          )
        {
            _repository = repository;
            _logger = logger;
            _privateSecretKey = privateSecretKey;
            _tokenValidationMinutes = tokenValidationMinutes;
        }

        public RatingResponse CreateRating(CreateRatingRequest createRatingRequest)
        {
            try
            {
                var createRating = _repository.CreateRating(createRatingRequest);

                if(createRating == null ) throw new Exception("");
                return createRating;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<RatingResponse> GetRating(Guid branch_id)
        {
            try
            {
                var getRatingByPartner = _repository.GetRating(branch_id);

                switch (getRatingByPartner)
                {
                   
                    case var _ when getRatingByPartner == null:
                        throw new Exception("");
                    default: return getRatingByPartner;
                        
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public RatingResponse GetRatingBranchByConsumerId(Guid branch_id, Guid consumer_id)
        {
            try
            {
               return _repository.GetRatingBranchByConsumerId(branch_id, consumer_id);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
