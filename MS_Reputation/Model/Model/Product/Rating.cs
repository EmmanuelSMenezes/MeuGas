using System;

namespace Domain.Model
{
  public class Rating
    {
        public Guid Rating_id { get; set; } 
        public Guid User_id { get; set; } 
	    public Guid Rating_type_id { get; set; }
        public int Rating_value { get; set; }
        public string Note { get; set; }
        public Guid Branch_id { get; set; }
        public Guid Created_by { get; set; }
        public Guid? Updated_by { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime? Updated_at { get; set; }
        
    }
}
