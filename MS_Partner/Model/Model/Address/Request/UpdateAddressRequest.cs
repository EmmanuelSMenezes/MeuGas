using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class UpdateAddressRequest
    {
        public Guid Address_id { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string Complement { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip_code { get; set; }
        public bool Active { get; set; }
        public Guid Updated_by { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
}
