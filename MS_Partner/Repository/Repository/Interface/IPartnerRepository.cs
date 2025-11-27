using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using System;
using System.Collections.Generic;

namespace Infrastructure.Repository
{
    public interface IPartnerRepository
    {
        Partner Create(CreatePartnerRequest partner);
        Partner Update(UpdatePartnerRequest partner);
        bool Delete(List<Guid> id);
        bool MassInactive(List<Guid> id);
        ListPartnerResponse GetPartners(Filter filter);
        Partner GetPartnerById(Guid partner_id);
        Partner GetPartnerByUserId(Guid user_id);
        Partner GetPartnerByAdminId(Guid admin_id, Filter filter);
        bool GetPartnerByDocument(string document);
        bool GetPartnerByEmail(string email);
        RateSettings GetRateSettings(Guid admin_id);
        List<Products> GetProductsCustomerFee(Guid partner_id);
    }
}