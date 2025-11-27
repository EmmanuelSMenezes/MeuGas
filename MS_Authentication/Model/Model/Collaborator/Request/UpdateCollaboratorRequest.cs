using System;

namespace Domain.Model
{
  public class UpdateCollaboratorRequest
  {
    public Guid Collaborator_id { get; set; }
    public bool Active { get; set; }
  }
}
