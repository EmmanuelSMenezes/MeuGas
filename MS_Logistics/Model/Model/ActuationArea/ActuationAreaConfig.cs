using System;
using System.Collections.Generic;

namespace Domain.Model
{

    public class ActuationAreaConfig
    {
        public Guid Actuation_area_config_id { get; set; }
        public Guid Actuation_area_id { get; set; }
        public string Start_hour { get; set; }
        public string End_hour { get; set; }
        public Guid Created_by { get; set; }
        public DateTime Created_at { get; set; }
        public Guid? Updated_by { get; set; }
        public DateTime? Updated_at { get; set; }
    }


    public class ActuationAreaShipping
    {
        public Guid Delivery_option_id { get; set; }
        public Guid Shipping_option_id { get; set; }
        public decimal Value { get; set; }
    }

}
