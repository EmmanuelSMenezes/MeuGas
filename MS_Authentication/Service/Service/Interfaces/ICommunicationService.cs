using System.Threading.Tasks;

namespace Application.Service
{
  public interface ICommunicationService
  {
    Task<bool> SendMail(string email, string subject, string body, string token);
    Task<bool> SendSMS(string phoneNumber, string body, string token);
  }
}
