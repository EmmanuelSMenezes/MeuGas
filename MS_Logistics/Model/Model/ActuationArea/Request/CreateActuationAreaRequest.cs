using System;

namespace Domain.Model
{
  public class CreateActuationAreaRequestProperties
  {
    public string Name { get; set; }
    public Guid Partner_id { get; set; }
    public Guid Created_by { get; set; }
    public Guid Branch_id { get; set; }
  }

  public class CreateActuationAreaRequest : BaseGeoJson<CreateActuationAreaRequestProperties>
  {

  }
}
