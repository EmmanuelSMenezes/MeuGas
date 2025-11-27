using System;

namespace Domain.Model
{
  public enum UserRole
  {
    ADM = 1,
    CONS = 2,
    PART = 3
  }
  public class Role
  {
    public Guid Role_id { get; set; }
    public String Description { get; set; }
    public String Tag { get; set; }
    public bool Active { get; set; }
    public DateTime Created_at { get; set; }
    public DateTime? Deleted_at { get; set; }
    public DateTime? Updated_at { get; set; }
  }
}
