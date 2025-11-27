using System;

namespace Domain.Model
{
    public class ShippingOptionsRequest
    {
        public bool Shipping_free { get; set; }
        public Guid Delivery_options_id { get; set; }
        public decimal Value { get; set; }

    }

}
