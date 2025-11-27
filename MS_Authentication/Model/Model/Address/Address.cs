using System;

namespace Domain.Model
{
  public class Address
  {
    public Guid Address_id { get; set; }
    public String Street { get; set; }
    public int Number { get; set; }
    public String Complement { get; set; }
    public String District { get; set; }
    public String City { get; set; }
    public String State { get; set; }
    public String Zip_code { get; set; }
    public bool Active { get; set; }
    public DateTime Created_at { get; set; }
    public DateTime? Deleted_at { get; set; }
    public DateTime? Updated_at { get; set; }
  }
}
