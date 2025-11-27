using System;
using Newtonsoft.Json;

namespace Domain.Model
{
  public class RequestChangePassword
  {
    public string Old_password { get; set; }
    public string Password { get; set; }
    public string PasswordConfirmation { get; set; }
    [JsonIgnore]
    public string HashedPassword { get; set; }
    [JsonIgnore]
    public Guid User_id { get; set; }
    [JsonIgnore]
    public Guid Role_id { get; set; }
    [JsonIgnore]
    public string Email { get; set; }
  }
}