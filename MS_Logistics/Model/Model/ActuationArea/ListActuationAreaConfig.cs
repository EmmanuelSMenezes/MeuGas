using System;
using System.Collections.Generic;

namespace Domain.Model
{

    public class ListActuationAreaConfig
    {
        public Guid Actuation_area_config_id { get; set; }
        public Guid Actuation_area_id { get; set; }
        public string Name { get; set; }
        public string Start_hour { get; set; }
        public string End_hour { get; set; }
        public List<PaymentOptions> Payment_options { get; set; }
        public List<WorkingDay> Working_days { get; set; }
        public List<ShippingOptions> Shipping_options { get; set; }
        public Guid Created_by { get; set; }
        public DateTime Created_at { get; set; }
        public Guid? Updated_by { get; set; }
        public DateTime? Updated_at { get; set; }
    }
    public class PaymentOptions
    {
        public Guid? Actuation_area_payments_id { get; set; }
        public Guid Payment_options_id { get; set; }
    }

    public class WorkingDay
    {
        public Guid? Working_day_id { get; set; }
        public int Day_number { get; set; }
    }

    public class ShippingOptions
    {
        public Guid? Actuation_area_shipping_id { get; set; }
        public Guid Delivery_option_id { get; set; }
        public bool Shipping_free { get; set; }
        public decimal Value { get; set; }
    }
}
