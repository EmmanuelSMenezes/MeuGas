using System.Collections.Generic;
public class Geometry
{
  public string Type { get; set; }
  public List<List<List<decimal>>> Coordinates { get; set; }
}

public class Feature<T>
{
  public string Type { get; } = "Feature";
  public Geometry Geometry { get; set; }
  public T Properties { get; set; }
}

public class BaseGeoJson<T>
{
  public string Type { get; } = "FeatureCollection";
  public List<Feature<T>> Features { get; set; }
}



