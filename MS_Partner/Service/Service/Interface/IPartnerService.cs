using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Service
{
    public interface IPartnerService
    {
        Partner Create(CreatePartnerRequest partner);
        Partner Update(UpdatePartnerRequest partner, string token);
        bool Delete(List<Guid> id);
        bool MassInactive(List<Guid> id);
        ListPartnerResponse GetPartners(Filter filter );
        Partner GetPartnerById(Guid partner_id);
        Partner GetPartnerByUserId(Guid user_id);
        Partner GetPartnerByAdminId(Guid admin, Filter filter);


    }
}
