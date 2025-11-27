using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request
{
    public class CreateBranchRequest
    {
        public string Branch_name { get; set; }
        public string Document { get; set; }
        public string Phone { get; set; }
        public Guid Partner_id { get; set; }
        public CreateAddressRequest Address { get; set; }
        public Guid Created_by { get; set; }
    }
}
