using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class CreatedRateSettingsRequest
    {
        public Guid Admin_id { get; set; }
        public decimal Service_fee { get; set; }
        public decimal Card_fee { get; set; }
        [JsonIgnore]
        public Guid Created_by { get; set; }
    }
}
