using Microsoft.AspNetCore.Http;
using NSwag.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class CreateStyleRequest
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
        public Guid Created_by { get; set; }
        [SwaggerIgnore]
        public string Url { get; set; }
    }
}
