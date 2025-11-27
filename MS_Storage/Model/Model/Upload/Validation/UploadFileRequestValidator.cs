using FluentValidation;

namespace Domain.Model
{
  public class UploadFileRequestValidator : AbstractValidator<UploadFileRequest>
  {
    public UploadFileRequestValidator()
    {
      RuleFor(s => s.bucketId)
        .NotEmpty().WithMessage("Id do bucket é obrigatorio.")
        .NotNull().WithMessage("Id do bucket é obrigatorio.");

      RuleFor(s => s.File)
        .NotEmpty().WithMessage("Arquivo para upload é obrigatorio.")
        .NotNull().WithMessage("Arquivo para upload é obrigatorio.");
    }
  }
}
