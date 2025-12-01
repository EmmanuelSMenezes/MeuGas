using System;

namespace Domain.Model
{
  public class VerifyOTPLoginRequest
  {
    public string OtpCode { get; set; }
    public string Phone { get; set; }
    public string Name { get; set; }
  }
}

