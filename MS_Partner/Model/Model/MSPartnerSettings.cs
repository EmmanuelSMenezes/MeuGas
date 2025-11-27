namespace Domain.Model
{
  public class MSPartnerSettings
  {
    public string ConnectionString { get; set; }

    public string PrivateSecretKey { get; set; }

    public string TokenValidationMinutes { get; set; }
  }
}