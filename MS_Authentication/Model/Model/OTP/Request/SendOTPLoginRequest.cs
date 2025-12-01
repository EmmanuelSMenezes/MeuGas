using System;

namespace Domain.Model
{
  public class SendOTPLoginRequest
  {
    public string Phone { get; set; }
    public string Name { get; set; }
  }
}

