using System.Collections.Generic;

namespace Domain.Model
{
  public class ListCollaborators
  {
    public List<Collaborator> Collaborators { get; set; }
    public Pagination Pagination { get; set; }
  }
}