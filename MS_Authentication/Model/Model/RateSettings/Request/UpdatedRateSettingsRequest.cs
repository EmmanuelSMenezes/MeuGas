using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class UpdatedRateSettingsRequest
    {
        public Guid Interest_rate_setting_id { get; set; }
        public Guid Admin_id { get; set; }
        public decimal Service_fee { get; set; }
        public decimal Card_fee { get; set; }
        [JsonIgnore]
        public Guid Updated_by { get; set; }
    }
}
