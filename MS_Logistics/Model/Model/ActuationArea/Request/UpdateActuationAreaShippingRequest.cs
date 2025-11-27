using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class UpdateActuationAreaShippingRequest
    {
        public Guid Actuation_area_config_id { get; set; }
        public Guid Actuation_area_id { get; set; }
        public string Start_hour { get;set; }
        public string End_hour { get; set; }
        public Guid Payment_local_id { get; set; }
        public decimal Value_minimum { get; set; }
        public Guid Pagseguro_value_minimum_id { get; set; }
        public List<WorkingDay> Working_day { get; set; }
        public List<PaymentOptions> Payment{ get; set; }
        public List<ShippingOptions> Shipping_options { get; set; }
        [JsonIgnore]
        public Guid Updated_by { get; set; }

    }

    
}
