using System;
using System.Collections.Generic;
using Domain.Model;

namespace Infrastructure.Repository
{
  public interface ICollaboratorRepository
  {
    Collaborator CreateCollaborator(CreateCollaboratorRequest createCollaboratorRequest);
    bool UpdateCollaborator(List<UpdateCollaboratorRequest> updateCollaboratorRequestList);
    bool DeleteCollaborator(List<Guid> ids);
    ListCollaborators ListCollaboratorsBySponsorId(FilterCollaborator filter, Guid sponsor_id);
    Collaborator GetCollaboratorByCollaboratorId(Guid collaborator_id);
    Collaborator GetCollaboratorByUserId(Guid user_id);
  }
}
