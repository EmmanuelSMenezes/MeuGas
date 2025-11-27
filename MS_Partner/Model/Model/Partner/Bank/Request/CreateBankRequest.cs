using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class CreateBankRequest
    {
        public Guid? Partner_id { get; set; }
        public string Bank { get; set; }
        public string Agency { get; set; }
        public string Account_number { get; set; }
        public string Account_id { get; set; }
        [JsonIgnore]
        public Guid Created_by { get; set; }
    }
}
