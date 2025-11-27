using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class Rating
    {
        public int? Rating_value { get; set; }
        public string? Note { get; set; }
        public DateTime? Created_at { get; set; }
    }
}
