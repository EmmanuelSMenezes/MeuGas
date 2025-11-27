using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using System;
using System.Collections.Generic;

namespace Infrastructure.Repository
{
    public interface IBranchRepository
    {
        Branch Create(CreateBranchRequest branch);
        Branch Update(Branch branch);
        bool Delete(List<Guid> id);
        List<Branch> GetBranchs();
        List<Branch> GetBranchsByPartnerId(Guid partner_id);
        Branch GetBranchById(string id);
        bool GetBranchByDocument(string document);
        ListBranchResponse ListBranchsByPartnerId(Guid branchId, Filter filter);
        DetailsBranch ListDetailsBranch(Guid branch_id, Filter filters);
    }
}
