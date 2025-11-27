using System;
using Newtonsoft.Json;

namespace Domain.Model
{
  public class CreateCollaboratorRequest
  {
    public UserRole RoleName { get; set; }
    public Guid Sponsor_id { get; set; }
    [JsonIgnore]
    public Guid Created_by { get; set; }
    public string Fullname { get; set; }
    public string Document { get; set; }
    public string Email { get; set; }
    [JsonIgnore]
    public string generatedPassword { get; set; }
    [JsonIgnore]
    public string Password { get; set; }
  }
}
