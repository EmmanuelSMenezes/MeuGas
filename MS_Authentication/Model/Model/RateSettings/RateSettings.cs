using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{ 
    public class RateSettings
    {
        public Guid Interest_rate_setting_id { get; set; }
        public Guid Admin_id { get; set; }
        public decimal Service_fee { get; set; }
        public decimal Card_fee { get; set; }
        public Guid Created_by { get; set; }
        public DateTime Created_at { get; set; }
        public Guid? Updated_by { get; set; }
        public DateTime? Updated_at { get;set; }
    }
}
