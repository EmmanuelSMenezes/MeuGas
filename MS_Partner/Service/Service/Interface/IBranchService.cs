using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Microsoft.CodeAnalysis.Operations;
using System;
using System.Collections.Generic;

namespace Application.Service
{
    public interface IBranchService
    {
        Branch Create(CreateBranchRequest branch);
        Branch Update(Branch branch);
        bool Delete(List<Guid> id);
        List<Branch> GetBranchs();
        List<Branch> GetBranchsByPartnerId(Guid partner_id);
        ListBranchResponse ListBranchsByPartnerId(Guid branchId, Filter filter);
        DetailsBranch ListDetailsBranch(Guid branch_id, Filter filters);
    }
}
