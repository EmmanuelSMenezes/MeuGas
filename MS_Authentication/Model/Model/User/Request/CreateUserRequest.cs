using System;

namespace Domain.Model
{
  public class CreateUserRequest
  {
    public string Email { get; set; }
    public string Password { get; set; }
    public UserRole RoleName { get; set; }
    public String Fullname { get; set; }
    public String Phone { get; set; }
    public String Document { get; set; }
    public bool generatedPassword { get; set;}
  }
}
