
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Domain.Model
{
    public class Products
    {
        [JsonProperty("product_id")]
        public Guid Product_id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
        [JsonProperty("price")]
        public decimal Price { get; set; }
        [JsonProperty("sale_price")]
        public decimal Sale_price { get; set; }
        [JsonProperty("active")]
        public bool Active { get; set; }
        [JsonProperty("updated_by")]
        public Guid Updated_by { get; set; }
        [JsonProperty("updated_at")]
        public DateTime Updated_at { get; set; }
        [JsonProperty("reviewer")]
        public bool Reviewer { get; set; }


    }
}
