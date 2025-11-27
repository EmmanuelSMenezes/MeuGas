using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class StylePartner
    {
        public Guid Style_partner_id { get; set; }
        public Guid Admin_id { get; set; }
        public string Lighter { get; set; }
        public string Light { get; set; }
        public string Main { get; set; }
        public string Dark { get; set; }
        public string Darker { get; set; }
        public string Contrasttext { get; set; }
        public string Logo { get; set; }
        public Guid Created_by { get; set; }
        public DateTime Created_at { get; set; }
        public Guid? Updated_by { get; set; }
        public DateTime? Updated_at { get; set; }
    }
}
