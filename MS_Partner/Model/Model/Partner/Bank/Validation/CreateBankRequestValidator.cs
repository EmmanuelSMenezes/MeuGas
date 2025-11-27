using Domain.Model.Request;
using FluentValidation;

namespace Domain.Model
{
    public class CreateBankRequestValidator : AbstractValidator<CreateBankRequest>
    {
        public CreateBankRequestValidator()
        {
            RuleFor(s => s.Partner_id)
              .NotEmpty().WithMessage("Id do parceiro é obrigatório.")
              .NotNull().WithMessage("Id do parceiro é obrigatório.");
            RuleFor(s => s.Bank)
              .NotEmpty().WithMessage("Número do banco é obrigatório.")
              .NotNull().WithMessage("Número do banco é obrigatório.");
            RuleFor(s => s.Agency)
              .NotEmpty().WithMessage("Número da agência é obrigatório.")
              .NotNull().WithMessage("Número da agência é obrigatório.");
            RuleFor(s => s.Account_number)
             .NotEmpty().WithMessage("Número da conta é obrigatório.")
             .NotNull().WithMessage("Número da conta é obrigatório.");
            RuleFor(s => s.Account_id)
             .NotEmpty().WithMessage("Número do id do pagseguro é obrigatório.")
             .NotNull().WithMessage("Número do id do pagseguro é obrigatório.");

        }
    }
}
