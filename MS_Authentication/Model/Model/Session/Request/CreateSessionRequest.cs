namespace Domain.Model
{
  public class CreateSessionRequest
  {
    public UserRole RoleName { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
  }
}

