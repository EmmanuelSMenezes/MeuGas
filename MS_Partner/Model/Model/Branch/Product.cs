using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Domain.Model
{
    public class Product
    {

        public Guid Product_id { get; set; }
        public int? Identifier { get; set; }
        public string Name { get; set; }
        public decimal? Price { get; set; }
        public Guid? Image_default { get; set; }
        public string Url { get; set; }
        public List<Category> Categories { get; set; }

    }

    public class Category
    {
        public Guid? Category_id { get; set; }
        public int? Identifier { get; set; }
        public string Description { get; set; }
        public string Category_parent_name { get; set; }
        public Guid? Category_parent_id { get; set; }
    }

}
