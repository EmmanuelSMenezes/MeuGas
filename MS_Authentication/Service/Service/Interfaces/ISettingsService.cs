using Domain.Model;
using System;
using System.Threading.Tasks;

namespace Application.Service
{
    public interface ISettingsService
    {
        RateSettingsResponse CreatedRateSettingsService(CreatedRateSettingsRequest createRateSettingsRequest, string token);
        RateSettingsResponse GetRateSettingsAdminService(Guid admin_id);
        RateSettingsResponse UpdatedRateSettingsService(UpdatedRateSettingsRequest updatedRateSettingsRequest, string token);
        Task<StylePartnerResponse> CreateStylePartnerService(CreateStyleRequest stylePartnerRequest, string token);
        StylePartnerResponse GetStylePartnerService(Guid admin_id);
        Task<StylePartnerResponse> UpdateStylePartnerService(UpdateStyleRequest stylePartnerRequest, string token);
        StyleConsumerResponse GetStyleConsumerService();
    }
}
