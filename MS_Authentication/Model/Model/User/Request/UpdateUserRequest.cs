using System;
using Microsoft.AspNetCore.Http;

namespace Domain.Model
{
  public class UpdateUserRequest
  {
    public Guid User_id { get; set; }
    public string Email { get; set; }
    public String Phone { get; set; }
    public String Fullname { get; set; }
    public IFormFile Avatar { get; set; }
    public String Document { get; set; }
    public bool? Active { get; set; }
    public bool? Phone_verified { get; set; }
  }
}
