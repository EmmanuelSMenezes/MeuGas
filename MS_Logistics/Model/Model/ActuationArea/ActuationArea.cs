using System;

namespace Domain.Model
{
  public class ActuationAreaProperties
  {
    public string Name { get; set; }
    public Guid Actuation_area_id { get; set; }
    public Guid Partner_id { get; set; }
    public Guid Branch_id { get; set; }
    public Guid Created_by { get; set; }
    public Guid? Updated_by { get; set; }
    public bool Active { get; set; }
    public DateTime? Created_at { get; set; }
    public DateTime? Updated_at { get; set; }
  }

  public class ActuationArea : BaseGeoJson<ActuationAreaProperties>
  {
    
  }
}
