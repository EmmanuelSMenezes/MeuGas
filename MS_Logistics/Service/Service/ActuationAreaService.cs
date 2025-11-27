using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Domain.Model;
using Infrastructure.Repository;
using Newtonsoft.Json;
using Serilog;

namespace Application.Service
{
    public class ActuationAreaService : IActuationAreaService
    {
        private readonly IActuationAreaRepository _repository;
        private readonly ILogger _logger;
        private readonly string _secretKey;

        public ActuationAreaService(
          IActuationAreaRepository repository,
          ILogger logger,
          string secretKey
          )
        {
            _repository = repository;
            _logger = logger;
            _secretKey = secretKey;
        }

        public ActuationArea CreateActuationArea(CreateActuationAreaRequest createActuationAreaRequest, string token)
        {
            try
            {
                var decodedToken = GetDecodeToken(token.Split(" ")[1], _secretKey);
                createActuationAreaRequest.Features[0].Properties.Created_by = decodedToken.UserId;
                var response = _repository.CreateActuationArea(createActuationAreaRequest);
                var feature = JsonConvert.DeserializeObject<Geometry>(response.GeometryJson);
                _logger.Information("[ActuationAreaService - CreateActuationArea]: Actuation Area registered successfully!");
                return new ActuationArea()
                {
                    Features = new List<Feature<ActuationAreaProperties>>() {
            new Feature<ActuationAreaProperties>() {
              Geometry = feature,
              Properties = new ActuationAreaProperties() {
                Active = response.Active,
                Actuation_area_id = response.Actuation_area_id,
                Created_at = response.Created_at,
                Created_by = response.Created_by,
                Name = response.Name,
                Partner_id = response.Partner_id,
                Updated_at = response.Updated_at,
                Updated_by = response.Updated_by,
                Branch_id = response.Branch_id
              }
            }
          }
                };
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - CreateActuationArea]: Error while register Actuation Area.");
                throw ex;
            }
        }
        public ActuationAreaShippingResponse CreateActuationAreaShippingOptions(CreateActuationAreaShippingRequest createActuationAreaShippingRequest, string token)
        {
            try
            {
                var getconfigarea = _repository.GetActuationAreaConfigByActuationAreaId(createActuationAreaShippingRequest.Actuation_area_id);
                if (getconfigarea != null) throw new Exception("AreaConfExists");

                var decodedToken = GetDecodeToken(token.Split(" ")[1], _secretKey);

                if (decodedToken == null) { throw new Exception("UserNotExists"); }
                
                createActuationAreaShippingRequest.Created_by = decodedToken.UserId;

                var response = _repository.CreateActuationAreaShippingOptions(createActuationAreaShippingRequest);

                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - CreateActuationAreaShippingOptions]: Error while register Shipping Options Actuation Area.");
                throw ex;
            }
        }

        public bool DeleteActuationArea(List<Guid> ids)
        {
            try
            {

                var response = _repository.DeleteActuationArea(ids);
                _logger.Information("[ActuationAreaService - DeleteActuationArea]: Actuation Areas deleted!");
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - DeleteActuationArea]: Error while delete Actuation Areas.");
                throw ex;
            }
        }

        public ActuationArea GetActuationAreaByActuationAreaId(Guid actuation_area_id)
        {
            try
            {

                var response = _repository.GetActuationAreaByActuationAreaId(actuation_area_id);
                var feature = JsonConvert.DeserializeObject<Geometry>(response.GeometryJson);

                _logger.Information("[ActuationAreaService - GetActuationAreaByActuationAreaId]: Actuation Area retrieved successfully!");
                return new ActuationArea()
                {
                    Features = new List<Feature<ActuationAreaProperties>>() {
            new Feature<ActuationAreaProperties>() {
              Geometry = feature,
              Properties = new ActuationAreaProperties() {
                Active = response.Active,
                Actuation_area_id = response.Actuation_area_id,
                Created_at = response.Created_at,
                Created_by = response.Created_by,
                Branch_id = response.Branch_id,
                Name = response.Name,
                Partner_id = response.Partner_id,
                Updated_at = response.Updated_at,
                Updated_by = response.Updated_by
              }
            }
          }
                };
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - GetActuationAreaByActuationAreaId]: Error while retrieve Actuation Area.");
                throw ex;
            }
        }

        public ListActuationArea GetActuationAreasByPartnerId(Guid partner_id, Filter filter)
        {
            try
            {
                var list = new List<ActuationArea>();
                var actuationAreas = _repository.GetActuationAreasByPartnerId(partner_id, filter);
                foreach (var actuationArea in actuationAreas)
                {
                    var feature = JsonConvert.DeserializeObject<Geometry>(actuationArea.GeometryJson);
                    list.Add(
                      new ActuationArea()
                      {
                          Features = new List<Feature<ActuationAreaProperties>>() {
                new Feature<ActuationAreaProperties>() {
                  Geometry = feature,
                  Properties = new ActuationAreaProperties() {
                    Active = actuationArea.Active,
                    Actuation_area_id = actuationArea.Actuation_area_id,
                    Created_at = actuationArea.Created_at,
                    Created_by = actuationArea.Created_by,
                    Name = actuationArea.Name,
                    Branch_id = actuationArea.Branch_id,
                    Partner_id = actuationArea.Partner_id,
                    Updated_at = actuationArea.Updated_at,
                    Updated_by = actuationArea.Updated_by
                  }
                }
                        }
                      }
                    );
                }

                int totalRows = list.Count();
                float totalPages = (float)totalRows / (float)filter.itensPerPage;
                totalPages = (float)Math.Ceiling(totalPages);
                list = list.Skip((int)((filter.page - 1) * filter.itensPerPage)).Take((int)filter.itensPerPage).ToList();

                _logger.Information("[ActuationAreaService - GetActuationAreasByPartnerId]: Actuation Areas retrieved in database!");
                return new ListActuationArea() 
                { 
                    Actuation_areas = list,
                    Pagination = new Pagination()
                    {
                        totalRows = totalRows,
                        totalPages = (int)totalPages,
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - GetActuationAreasByPartnerId]: Error while retrieve Actuation Areas.");
                throw ex;
            }
        }

        public ActuationArea UpdateActuationArea(UpdateActuationAreaRequest updateActuationAreaRequest, string token)
        {
            try
            {
                var decodedToken = GetDecodeToken(token.Split(" ")[1], _secretKey);
                updateActuationAreaRequest.Features[0].Properties.Updated_by = decodedToken.UserId;
                var response = _repository.UpdateActuationArea(updateActuationAreaRequest);
                _logger.Information("[ActuationAreaService - UpdateActuationArea]: Actuation Areas updated successfully!");
                var feature = JsonConvert.DeserializeObject<Geometry>(response.GeometryJson);
                return new ActuationArea()
                {
                    Features = new List<Feature<ActuationAreaProperties>>() {
            new Feature<ActuationAreaProperties>() {
              Geometry = feature,
              Properties = new ActuationAreaProperties() {
                Active = response.Active,
                Actuation_area_id = response.Actuation_area_id,
                Created_at = response.Created_at,
                Created_by = response.Created_by,
                Name = response.Name,
                Partner_id = response.Partner_id,
                Updated_at = response.Updated_at,
                Updated_by = response.Updated_by
              }
            }
          }
                };

            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - UpdateActuationArea]: Error while update Actuation Area.");
                throw ex;
            }
        }

        public DecodedToken GetDecodeToken(string token, string secret)
        {
            DecodedToken decodedToken = new DecodedToken();
            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtSecurityToken = jwtSecurityTokenHandler.ReadToken(token) as JwtSecurityToken;
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
        public List<DeliveryOption> GetActuationAreaDeliveryOption()
        {
            try
            {
                return _repository.GetActuationAreaDeliveryOption();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - GetActuationAreaDeliveryOption]: Error while listing Actuation Areas Delivery Option.");
                throw ex;
            }
        }
        public ListActuationAreaConfig GetActuationAreaConfigByActuationAreaId(Guid actuation_area_id)
        {
            try
            {
                return _repository.GetActuationAreaConfigByActuationAreaId(actuation_area_id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - GetActuationAreaConfigByActuationAreaId]: Error while listing config Actuation Areas Delivery Option.");
                throw ex;
            }
        }
        public ActuationAreaShippingResponse UpdateActuationAreaShippingOptions(UpdateActuationAreaShippingRequest updateActuationAreaShippingRequest, string token)
        {
            try
            {
                var decodedToken = GetDecodeToken(token.Split(" ")[1], _secretKey);

                if (decodedToken == null) { throw new Exception("UserNotExists"); }

                updateActuationAreaShippingRequest.Updated_by = decodedToken.UserId;

                var getareaconfig = _repository.GetActuationAreaConfigByActuationAreaId(updateActuationAreaShippingRequest.Actuation_area_id);
              
                var response = _repository.UpdateActuationAreaShippingOptions(updateActuationAreaShippingRequest, getareaconfig);

                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaService - CreateActuationAreaShippingOptions]: Error while register Shipping Options Actuation Area.");
                throw ex;
            }
        }

    }
}
