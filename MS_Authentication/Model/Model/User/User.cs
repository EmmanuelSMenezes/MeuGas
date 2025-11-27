namespace Domain.Model
{
  public class User : Credentials
  {
    public Role Role { get; set; }
    public Profile Profile { get; set; }
  }
}
