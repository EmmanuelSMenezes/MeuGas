using FluentValidation;

namespace Domain.Model
{
  public class CreateSessionRequestValidator : AbstractValidator<CreateSessionRequest>
  {
    public CreateSessionRequestValidator()
    {
      RuleFor(s => s.RoleName)
        .NotEmpty().WithMessage("RoleName é obrigatório.")
        .NotNull().WithMessage("RoleName é obrigatório.")
        .IsInEnum().WithMessage("RoleName inválido.");

      When(s => s.RoleName == UserRole.CONS, () =>
      {
        RuleFor(s => s.Email)
        .NotEmpty()
        .When(s => string.IsNullOrEmpty(s.Phone), ApplyConditionTo.CurrentValidator)
        .WithMessage("Endereço de email é obrigatório.")
        .EmailAddress()
        .WithMessage("Endereço de email inválido.");
        RuleFor(s => s.Phone)
        .NotEmpty()
        .When(s => string.IsNullOrEmpty(s.Email), ApplyConditionTo.CurrentValidator)
        .WithMessage("Telefone é obrigatório.");
        RuleFor(s => s.Password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.");
      });

      When(s => s.RoleName == UserRole.ADM, () =>
      {
        RuleFor(s => s.Email)
        .NotEmpty()
        .WithMessage("Endereço de email é obrigatório.")
        .EmailAddress()
        .WithMessage("Endereço de email inválido.");
        RuleFor(s => s.Phone).Empty();
        RuleFor(s => s.Password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.");
      });

      When(s => s.RoleName == UserRole.PART, () =>
      {
        RuleFor(s => s.Email)
        .NotEmpty()
        .WithMessage("Endereço de email é obrigatório.")
        .EmailAddress()
        .WithMessage("Endereço de email inválido.");
        RuleFor(s => s.Phone).Empty();
        RuleFor(s => s.Password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.");
      });
    }
  }
}
