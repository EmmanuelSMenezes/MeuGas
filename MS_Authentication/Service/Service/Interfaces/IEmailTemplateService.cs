using Domain.Model;

namespace Application.Service
{
  public interface IEmailTemplateService
  {
    BaseTemplateReturn ForgotPassword(ForgotPassword forgotPassword);
    BaseTemplateReturn FirstAccessPartner(FirstAccessPartner firstAccessPartner);
    BaseTemplateReturn FirstAccessCollaborator(FirstAccessCollaborator firstAccessCollaborator);
  }
}
