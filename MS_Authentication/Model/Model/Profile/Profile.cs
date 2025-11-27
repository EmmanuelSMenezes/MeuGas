using System;

namespace Domain.Model
{
  public class Profile
  {
    public Guid Profile_id { get; set; }
    public String Fullname { get; set; }
    public String Avatar { get; set; }
    public String Document { get; set; }
    public bool Active { get; set; }
    public DateTime Created_at { get; set; }
    public DateTime? Deleted_at { get; set; }
    public DateTime? Updated_at { get; set; }
    public Guid User_id { get; set; }
  }
}
