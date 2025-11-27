using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Model;

namespace Application.Service
{
  public interface ICollaboratorService
  {
    Task<Collaborator> CreateCollaborator(CreateCollaboratorRequest createCollaboratorRequest, string token);
    bool UpdateCollaborator(List<UpdateCollaboratorRequest> updateCollaboratorRequestList);
    bool DeleteCollaborator(List<Guid> ids);
    ListCollaborators ListCollaboratorsBySponsorId(FilterCollaborator filter, Guid sponsor_id);
  }
}
