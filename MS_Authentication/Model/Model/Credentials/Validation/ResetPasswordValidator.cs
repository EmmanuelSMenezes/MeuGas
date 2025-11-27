using FluentValidation;

namespace Domain.Model
{
  public class ResetPasswordValidator : AbstractValidator<RequestResetPassword>
  {
    public ResetPasswordValidator()
    {
      
      RuleFor(s => s.password)
        .NotEmpty()
        .WithMessage("Senha é obrigatória.")
        .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&\!@#%.\-\^~_])[0-9a-zA-Z$*&\!@#%.\-\^~_]{8,}$")
        .WithMessage("Sua senha deve ter no mínimo 8 caracteres e conter no mínimo: 1 letra maiúscula, 1 caractere especial.");

      RuleFor(s => s.passwordConfirmation)
        .Equal(s => s.password)
        .WithMessage("A confirmação de senha deve ser igual a senha.");
    }
  }
}
