
namespace Domain.Model
{
  public class SendSMSRequest
  {
    public string ToPhoneNumber { get; set; }
    public string Body { get; set; }
  }
}
