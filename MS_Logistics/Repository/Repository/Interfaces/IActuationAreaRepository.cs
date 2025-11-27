using System;
using System.Collections.Generic;
using Domain.Model;

namespace Infrastructure.Repository
{
    public interface IActuationAreaRepository
    {
        ActuationAreaBD CreateActuationArea(CreateActuationAreaRequest createActuationAreaRequest);
        ActuationAreaShippingResponse CreateActuationAreaShippingOptions(CreateActuationAreaShippingRequest createActuationAreaShippingRequest);
        ActuationAreaBD UpdateActuationArea(UpdateActuationAreaRequest updateActuationAreaRequest);
        bool DeleteActuationArea(List<Guid> ids);
        List<ActuationAreaBD> GetActuationAreasByPartnerId(Guid partner_id, Filter filter);
        ActuationAreaBD GetActuationAreaByActuationAreaId(Guid actuation_area_id);
        List<DeliveryOption> GetActuationAreaDeliveryOption();
        ListActuationAreaConfig GetActuationAreaConfigByActuationAreaId(Guid actuation_area_id);
        ActuationAreaShippingResponse UpdateActuationAreaShippingOptions(UpdateActuationAreaShippingRequest updateActuationAreaShippingRequest, ListActuationAreaConfig areaConfig);

    }
}
