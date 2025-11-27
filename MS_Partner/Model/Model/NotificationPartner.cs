using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class NotificationPartner
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
        [JsonProperty("user_id")]
        public Guid User_id { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("created_at")]
        public DateTime Created_at { get; set; }
    }
}
