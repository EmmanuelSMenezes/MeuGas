using System;

namespace Domain.Model
{
  public class CreateUserResponse
  {
    public Guid User_id { get; set; }
    public Guid? Admin_id { get; set; }
    public String Email { get; set; }
    public String Phone { get; set; }
    public bool Active { get; set; }
    public Guid Role_id { get; set; }
    public bool Password_generated { get; set; }
    public bool Phone_verified { get; set; }
    public DateTime? Last_login { get; set; }
    public DateTime Created_at { get; set; }
    public DateTime? Deleted_at { get; set; }
    public DateTime? Updated_at { get; set; }
    public Role Role { get; set; }
    public Profile Profile { get; set; }
    public bool IsCollaborator { get; set; }
    public bool IsActiveCollaborator { get; set; }
    public Guid? Sponsor_id { get; set; }
  }
}
