using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class UpdateBranchRequest
    {
        public Guid Branch_id { get; set; }
        public string Branch_name { get; set; }
        public string Document { get; set; }
        public string Phone { get; set; }
        public Guid Partner_id { get; set; }
        public UpdateAddressRequest Address { get; set; }
        public Guid Updated_by { get; set; }
    }
}
