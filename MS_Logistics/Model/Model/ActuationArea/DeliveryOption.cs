using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class DeliveryOption
    {
        public Guid Delivery_option_id { get; set; }
        public string Name { get; set; }
        public Guid Created_by { get; set; }
        public DateTime Created_at { get; set; }
        public Guid? Updated_by { get; set; }
        public DateTime? Updated_at { get; set; }
    }

}
