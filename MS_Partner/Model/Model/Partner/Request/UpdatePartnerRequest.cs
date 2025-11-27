using Domain.Model.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class UpdatePartnerRequest
    {
        public Guid Partner_id { get; set; }
        public string Legal_name { get; set; }
        public string Fantasy_name { get; set; }
        public string Document { get; set; }
        public string Email { get; set; }
        public string Phone_number { get; set; }
        public List<UpdateBranchRequest> Branch { get; set; }
        public Guid updated_by { get; set; }
        public Guid User_id { get; set; }
        public Guid Admin_id { get; set; }
        public bool Active { get; set; }
        public decimal Service_fee { get; set; }
        public decimal Card_fee { get; set; }
    }
}
