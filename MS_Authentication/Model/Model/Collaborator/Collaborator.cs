using System;

namespace Domain.Model
{
  public class Collaborator
  {
    public Guid Collaborator_id { get; set; }
    public Guid User_id { get; set; }
    public Guid Sponsor_id { get; set; }
    public string Fullname { get; set; }
    public string Email { get; set; }
    public bool Active { get; set; }
    public Guid Created_by { get; set; }
    public Guid? Updated_by { get; set; }
    public Profile Profile { get; set; }
    public Role Role { get; set; }
  }
}
