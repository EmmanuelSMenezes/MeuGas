using System;
namespace Domain.Model
{
  public enum OtpType {
    SMS = 1,
    EMAIL = 2
  }
  public class OTP
  {
    public Guid Otp_id { get; set; }
    public Guid User_id { get; set; }
    public string otp { get; set; }
    public DateTime? expiry { get; set; }
    public bool used { get; set; }
    public DateTime? created_at { get; set; }
    public DateTime? updated_at { get; set; }
    public OtpType type { get; set; }
  }
}
