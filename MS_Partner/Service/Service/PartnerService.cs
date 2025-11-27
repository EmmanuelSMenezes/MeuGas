using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Infrastructure.Repository;
using Newtonsoft.Json;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace Application.Service
{
    public class PartnerService : IPartnerService
    {
        private readonly IPartnerRepository _repository;
        private readonly IBranchService _branchService;
        private readonly ILogger _logger;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;
        private HttpEndPoints _httpEndPoints = new HttpEndPoints();

        public PartnerService(IPartnerRepository repository, IBranchService branchService,
            ILogger logger, string privateSecretKey, string tokenValidationMinutes, HttpEndPoints httpEndPoints)
        {
            _repository = repository;
            _branchService = branchService;
            _logger = logger;
            _privateSecretKey = privateSecretKey;
            _tokenValidationMinutes = tokenValidationMinutes;
            _httpEndPoints = httpEndPoints;
        }

        public Partner Create(CreatePartnerRequest partner)
        {
            try
            {
                var existingpartnerbyemail = _repository.GetPartnerByEmail(partner.Email);
                var existingpartnerbydocument = _repository.GetPartnerByDocument(partner.Document);

                if (existingpartnerbyemail) throw new Exception("partnerAlreadyCreatedEmail");
                if (existingpartnerbydocument) throw new Exception("partnerAlreadyCreateddocument");

                var getratesettings = _repository.GetRateSettings(partner.Admin_id);
                if (getratesettings != null)
                {
                    partner.Service_fee = getratesettings.Service_fee;
                    partner.Card_fee = getratesettings.Card_fee;
                }

                var postPartnerResponse = _repository.Create(partner);
                var responseBranchs = _branchService.GetBranchsByPartnerId(postPartnerResponse.Partner_id);

                if (postPartnerResponse != null)
                {
                    postPartnerResponse.Branch = responseBranchs;
                    return postPartnerResponse;
                }
                else
                {
                    throw new Exception("partnerNotCreated");
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Partner Update(UpdatePartnerRequest partner, string token)
        {
            try
            {
                var existingPartnerResponse = _repository.GetPartnerById(partner.Partner_id);
                var postPartnerResponse = _repository.Update(partner);

                UpdateReviewerProduct(partner.Partner_id, token);
                NotificationPartner(token, postPartnerResponse.Created_by);
                return postPartnerResponse;


            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception in Update!");
                throw ex;
            }
        }

        private async void UpdateReviewerProduct(Guid partner_id, string token)
        {
            try
            {
                var products = _repository.GetProductsCustomerFee(partner_id);

                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", token);

                foreach (var product in products)
                {
                    product.Reviewer = true;
                    var body = JsonConvert.SerializeObject(product);
                    var requestContent = new StringContent(body, Encoding.UTF8, "application/json");
                    var uri = $"{_httpEndPoints.MSCatalogUrl}partner/product/update";
                    HttpResponseMessage response = null;
                    response = await httpClient.PutAsync(uri, requestContent);
                    if (response.StatusCode != System.Net.HttpStatusCode.OK)
                    {
                        _logger.Information($"{response.Content.ReadAsStringAsync().Result}");
                    }

                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        private async void NotificationPartner(string token, Guid user_id)
        {
            try
            {
                HttpClient httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", token);

                var notification = new NotificationPartner()
                {
                    Title = "Revisão de preço.",
                    Description = "As taxas de serviço foram atualizadas, revise o valor dos produtos.",
                    Type = "INFO",
                    Created_at = DateTime.Now,
                    User_id = user_id
                };

                var body = JsonConvert.SerializeObject(notification);
                var requestContent = new StringContent(body, Encoding.UTF8, "application/json");
                var uri = $"{_httpEndPoints.MSCommBaseUrl}notification/create";
                HttpResponseMessage response = null;
                response = await httpClient.PostAsync(uri, requestContent);
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    _logger.Information($"{response.Content.ReadAsStringAsync().Result}");
                }

            }
            catch (Exception)
            {

                throw;
            }
        }
        public bool MassInactive(List<Guid> id)
        {
            try
            {
                var existingPartnerResponse = _repository.MassInactive(id);
                return existingPartnerResponse;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception in Update!");
            }
            return false;
        }

        public bool Delete(List<Guid> id)
        {
            try
            {
                var response = _repository.Delete(id);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception in Delete!");
            }
            return false;
        }

        public ListPartnerResponse GetPartners(Filter filter)
        {
            try
            {
                var partners = _repository.GetPartners(filter);
                switch (partners)
                {

                    case var _ when partners == null:
                        throw new Exception("");
                    default: return partners;

                }
                return partners;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception in GetPartners!");
                throw ex;
            }
        }

        public Partner GetPartnerById(Guid partner_id)
        {
            try
            {
                var response = _repository.GetPartnerById(partner_id);

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Partner GetPartnerByUserId(Guid user_id)
        {
            try
            {
                var response = _repository.GetPartnerByUserId(user_id);
                var responseBranchs = _branchService.GetBranchsByPartnerId(response.Partner_id);
                response.Branch = responseBranchs;
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Partner GetPartnerByAdminId(Guid admin_id, Filter filter)
        {
            try
            {
                var response = _repository.GetPartnerByAdminId(admin_id, filter);
                return response;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
