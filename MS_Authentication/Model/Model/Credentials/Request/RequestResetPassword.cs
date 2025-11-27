using System;
using Newtonsoft.Json;

namespace Domain.Model
{
  public class RequestResetPassword
  {
    public string password { get; set; }
    public string passwordConfirmation { get; set; }
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