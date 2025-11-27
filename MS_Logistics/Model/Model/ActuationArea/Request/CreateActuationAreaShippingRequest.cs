using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class CreateActuationAreaShippingRequest
    {
        public Guid Actuation_area_id { get; set; }
        public string Start_hour { get;set; }
        public string End_hour { get; set; }
        public List<int> Working_day { get; set; }
        public List<Guid> Payment{ get; set; }
        public List<ShippingOptionsRequest> Shipping_options { get; set; }
        [JsonIgnore]
        public Guid Created_by { get; set; }

    }
}
