using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request
{
    public class CreatePartnerRequest
    {
        public string Legal_name { get; set; }
        public string Fantasy_name { get; set; }
        public string Document { get; set; }
        public string Email { get; set; }
        public string Phone_number { get; set; }
        public List<CreateBranchRequest> Branch { get; set; }
        public Guid Created_by { get; set; }
        public Guid User_id { get; set; }
        public Guid Admin_id { get; set; }
        [JsonIgnore]
        public decimal Service_fee { get; set; } = 0;
        [JsonIgnore]
        public decimal Card_fee { get; set; } = 0;
    }
}
