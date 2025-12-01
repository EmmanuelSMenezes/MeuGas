using System.Threading.Tasks;
using Domain.Model;

namespace Application.Service
{
  public interface IOtpService
  {
    OneTimePassword GenerateOTP();
    Task<bool> SendOtpConfirmation(string token);
    Task<bool> SendOtpForgotPassword(string phone_number);
    Task<bool> SendOtpLogin(string phone, string name);
    Task<bool> VerifyOtpCode(string otp_code, string token);
    Task<CreateSessionResponse> VerifyOtpCodeForgotPassword(string otp_code, string phone_number);
    Task<CreateSessionResponse> VerifyOtpLogin(string otp_code, string phone, string name);
  }
}
