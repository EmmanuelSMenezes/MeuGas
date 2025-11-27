using FluentValidation;

namespace Domain.Model
{
    public class CreateRatingRequestValidator : AbstractValidator<CreateRatingRequest>
    {
        public CreateRatingRequestValidator()
        {
            RuleFor(s => s.Created_by)
              .NotEmpty().WithMessage("Created_by é obrigatório.")
              .NotNull().WithMessage("Created_by é obrigatório.");
            RuleFor(s => s.Branch_id)
              .NotEmpty().WithMessage("Filial é obrigatório.")
              .NotNull().WithMessage("Filial é obrigatório.");
            RuleFor(s => s.Rating_type_id)
             .NotEmpty().WithMessage("Tipo de avaliação é obrigatório.")
             .NotNull().WithMessage("Tipo de avaliação é obrigatório.");
            RuleFor(s => s.Rating_value)
            .NotEmpty().WithMessage("Valor da avaliação é obrigatório.")
            .NotNull().WithMessage("Valor da avaliação é obrigatório.");

        }
    }
}
