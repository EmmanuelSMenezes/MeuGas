using Domain.Model;
using System;

namespace Infrastructure.Repository
{
    public interface ISettingsRepository
    {
        RateSettingsResponse CreatedRateSettingsRepository(CreatedRateSettingsRequest createdRateSettingsRequest);
        RateSettingsResponse GetRateSettingsAdminRepository(Guid admin_id);
        RateSettingsResponse UpdatedRateSettingsRepository(UpdatedRateSettingsRequest updatedRateSettingsRequest);
        StylePartnerResponse CreateStylePartnerRepository(CreateStyleRequest stylePartnerRequest);
        StylePartnerResponse GetStylePartnerRepository(Guid admin_id);
        StylePartnerResponse UpdateStylePartnerRepository(UpdateStyleRequest stylePartnerRequest);
        StyleConsumerResponse CreateStyleConsumerRepository(CreateStyleRequest styleRequest);
        StyleConsumerResponse UpdateStyleConsumerRepository(UpdateStyleRequest stylePartnerRequest);
        StyleConsumerResponse GetStyleConsumerRepository();

    }
}
