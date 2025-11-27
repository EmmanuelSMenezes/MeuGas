
namespace Domain.Model
{
  public class OneTimePassword
  {
    public string OtpCode { get; set; }
    public string HashedOtpCode { get; set; }
  }
}
