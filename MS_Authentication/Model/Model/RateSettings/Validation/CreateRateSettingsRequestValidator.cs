using FluentValidation;

namespace Domain.Model
{
    public class CreateRateSettingsRequestValidator : AbstractValidator<CreatedRateSettingsRequest>
    {
        public CreateRateSettingsRequestValidator()
        {
            RuleFor(s => s.Admin_id)
              .NotEmpty().WithMessage("Administrador é obrigatório.")
              .NotNull().WithMessage("Administrador é obrigatório.");

            RuleFor(s => s.Service_fee)
             .NotEmpty().WithMessage("Taxa de serviço é obrigatório.")
             .NotNull().WithMessage("Taxa de serviço é obrigatório.");

            RuleFor(s => s.Card_fee)
                 .NotEmpty().WithMessage("Taxa do cartão é obrigatório.")
                 .NotNull().WithMessage("Taxa do cartão é obrigatório.");
        }
    }
}
