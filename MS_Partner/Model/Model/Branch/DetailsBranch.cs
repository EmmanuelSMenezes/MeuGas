using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class DetailsBranch
    {
        public Guid Branch_id { get; set; }
        public string Branch_name { get; set; }
        public Guid Partner_id { get; set; }
        public decimal Ratings { get; set; }
        public string? Avatar { get; set; } 
        public ListProduct Product { get; set; }
        public Address Address { get; set; }
    }

    public class ListProduct
    {
        public List<Product> Products { get; set; }
        public Pagination Pagination { get; set; }
    }
}
