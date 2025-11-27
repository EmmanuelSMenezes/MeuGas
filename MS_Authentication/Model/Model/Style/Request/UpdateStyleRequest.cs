using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using NSwag.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class UpdateStyleRequest
    {
        public Guid Admin_id { get; set; }
        public string Lighter { get; set; }
        public string Light { get; set; }
        public string Main { get; set; }
        public string Dark { get; set; }
        public string Darker { get; set; }
        public string Contrasttext { get; set; }
        public IFormFile Logo { get; set; } = null;
        [SwaggerIgnore]
        public Guid Updated_by { get; set; }
        public string Url { get; set; }
    }
}
