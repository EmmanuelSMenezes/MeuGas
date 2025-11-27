using FluentValidation;

namespace Domain.Model
{
  public class UpdateStylePartnerRequestValidator : AbstractValidator<UpdateStyleRequest>
  {
    public UpdateStylePartnerRequestValidator()
    {
            RuleFor(s => s.Admin_id)
          .NotEmpty().WithMessage("Id do administrador é obrigatório.")
          .NotNull().WithMessage("Id do administrador é obrigatório.");


    }
  }
}
