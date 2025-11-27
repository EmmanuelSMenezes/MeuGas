using System;
using Domain.Model;

namespace Infrastructure.Repository
{
  public interface IOtpRepository
  {
    OTP CreateOtp(Guid user_id, string generatedOtp, OtpType Type);
    OTP GetOTP(Guid user_id);
    OTP UpdateOTP(OTP otp);
  }
}
