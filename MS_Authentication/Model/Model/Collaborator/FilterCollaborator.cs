namespace Domain.Model
{
  public class FilterCollaborator
  {
    public int ItensPerPage { get; set; } = 5;
    public int Page { get; set; }
    public string Filter { get; set; }
  }
}