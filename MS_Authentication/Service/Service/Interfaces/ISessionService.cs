using Domain.Model;

namespace Application.Service
{
  public interface ISessionService
  {
    CreateSessionResponse CreateSessionService(CreateSessionRequest createSessionRequest);
  }
}
