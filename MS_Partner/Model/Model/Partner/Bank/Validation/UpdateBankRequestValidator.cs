using Domain.Model.Request;
using FluentValidation;

namespace Domain.Model
{
    public class UpdateBankRequestValidator : AbstractValidator<UpdateBankRequest>
    {
        public UpdateBankRequestValidator()
        {
            RuleFor(s => s.Bank_details_id)
              .NotEmpty().WithMessage("Id de cadastro é obrigatório.")
              .NotNull().WithMessage("Id de cadastro é obrigatório.");
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
