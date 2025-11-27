using FluentValidation;

namespace Domain.Model
{
  public class CreateStylePartnerRequestValidator : AbstractValidator<CreateStyleRequest>
  {
    public CreateStylePartnerRequestValidator()
    {
            RuleFor(s => s.Admin_id)
          .NotEmpty().WithMessage("Id do administrador é obrigatório.")
          .NotNull().WithMessage("Id do administrador é obrigatório.");


    }
  }
}
