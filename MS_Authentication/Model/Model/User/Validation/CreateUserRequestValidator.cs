using FluentValidation;

namespace Domain.Model
{
  public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
  {
    public CreateUserRequestValidator()
    {
      RuleFor(s => s.RoleName)
        .NotEmpty().WithMessage("RoleName é obrigatório.")
        .NotNull().WithMessage("RoleName é obrigatório.")
        .IsInEnum().WithMessage("RoleName inválido.");

      When(s => s.RoleName == UserRole.CONS, () =>
      {
        RuleFor(s => s.Email)
        .NotEmpty()
        .When(s => string.IsNullOrEmpty(s.Phone))
        .WithMessage("Endereço de email é obrigatório.")
        .EmailAddress()
        .WithMessage("Endereço de email inválido.");
        RuleFor(s => s.Phone)
        .NotEmpty()
        .When(s => string.IsNullOrEmpty(s.Email))
        .WithMessage("Telefone é obrigatório.");
        RuleFor(s => s.Password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.")
        .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&\!@#%.\-\^~_])[0-9a-zA-Z$*&\!@#%.\-\^~_]{8,}$")
        .WithMessage("Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1 caractere especial.");
      });

      When(s => s.RoleName == UserRole.ADM, () =>
      {
        RuleFor(s => s.Email)
        .NotEmpty()
        .WithMessage("Endereço de email é obrigatório.")
        .EmailAddress()
        .WithMessage("Endereço de email inválido.");
        RuleFor(s => s.Password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.")
        .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&\!@#%.\-\^~_])[0-9a-zA-Z$*&\!@#%.\-\^~_]{8,}$")
        .WithMessage("Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1 caractere especial.");
      });

      When(s => s.RoleName == UserRole.PART, () =>
      {
        RuleFor(s => s.Email)
        .NotEmpty()
        .WithMessage("Endereço de email é obrigatório.")
        .EmailAddress()
        .WithMessage("Endereço de email inválido.");
      });

      When(s => !s.generatedPassword, () => {
        RuleFor(s => s.Password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.")
        .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&\!@#%.\-\^~_])[0-9a-zA-Z$*&\!@#%.\-\^~_]{8,}$")
        .WithMessage("Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1 caractere especial.");
      });

      RuleFor(s => s.Document)
        .NotNull().WithMessage("Numero do documento é obrigatório.")
        .NotEmpty().WithMessage("Numero do documento é obrigatório.")
        .MinimumLength(11).WithMessage("Numero do docuemnto deve conter no mínimo 11 e no máximo 14 caracteres.")
        .MaximumLength(14).WithMessage("Numero do docuemnto deve conter no mínimo 11 e no máximo 14 caracteres.");

      RuleFor(s => s.Fullname)
        .NotNull().WithMessage("Nome completo é obrigatório.")
        .NotEmpty().WithMessage("Nome completo é obrigatório.");

    }
  }
}
