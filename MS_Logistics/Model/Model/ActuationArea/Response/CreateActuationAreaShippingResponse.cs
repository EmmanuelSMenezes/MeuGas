using System;
using System.Collections.Generic;

namespace Domain.Model
{
    public class ActuationAreaShippingResponse
    {
        public ActuationAreaConfig Actuation_area_Config { get; set; }
        public List<int> Working_day { get; set; }
        public List<Guid> Payment { get; set; }
        public List<ActuationAreaShipping> Actuation_area_shipping { get; set; }
    }
}
