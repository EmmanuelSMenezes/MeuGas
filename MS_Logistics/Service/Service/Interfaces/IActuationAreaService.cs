using System;
using System.Collections.Generic;
using Domain.Model;

namespace Application.Service
{
    public interface IActuationAreaService
    {
        ActuationArea CreateActuationArea(CreateActuationAreaRequest createActuationAreaRequest, string token);
        ActuationAreaShippingResponse CreateActuationAreaShippingOptions(CreateActuationAreaShippingRequest createActuationAreaShippingRequest1, string token);
        ActuationAreaShippingResponse UpdateActuationAreaShippingOptions(UpdateActuationAreaShippingRequest updateActuationAreaShippingRequest, string token);
        ActuationArea UpdateActuationArea(UpdateActuationAreaRequest updateActuationAreaRequest, string token);
        bool DeleteActuationArea(List<Guid> ids);
        ListActuationArea GetActuationAreasByPartnerId(Guid partner_id, Filter filter);
        ActuationArea GetActuationAreaByActuationAreaId(Guid actuation_area_id);
        DecodedToken GetDecodeToken(string token, string secret);
        List<DeliveryOption> GetActuationAreaDeliveryOption();
        ListActuationAreaConfig GetActuationAreaConfigByActuationAreaId(Guid actuation_area_id);
    }
}
