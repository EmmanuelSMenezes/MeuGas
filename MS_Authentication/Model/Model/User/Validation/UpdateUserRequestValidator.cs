using FluentValidation;

namespace Domain.Model
{
  public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
  {
    public UpdateUserRequestValidator()
    {
      RuleFor(u => u.Email)
        .NotNull().WithMessage("Endereço de email é obrigatório.")
        .NotEmpty().WithMessage("Endereço de email é obrigatório.")
        .EmailAddress().WithMessage("Endereço de email inválido.");

      RuleFor(u => u.Phone)
        .MinimumLength(10).MaximumLength(11).WithMessage("O Telefone deve conter no mínimo 10 digitos e no maximo 11.")
        .NotNull().WithMessage("Telefone é obrigatório.")
        .NotEmpty().WithMessage("Telefone é obrigatório.");

      RuleFor(u => u.Fullname)
        .NotNull().WithMessage("Nome é obrigatório.")
        .NotEmpty().WithMessage("Nome é obrigatório.");

      RuleFor(u => u.User_id)
        .NotNull().WithMessage("Id do Usuário é obrigatório.")
        .NotEmpty().WithMessage("Id do Usuário é obrigatório.");

      RuleFor(u => u.Document)
        .MinimumLength(11).MaximumLength(14).WithMessage("O numero do documento deve conter no minimo 11 caracteres e no maximo 14 caracteres.")
        .NotNull().WithMessage("Numero do documento é obrigatório.")
        .NotEmpty().WithMessage("Numero do documento é obrigatório.");

    }
  }
}
