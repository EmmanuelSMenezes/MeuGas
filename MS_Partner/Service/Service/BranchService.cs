using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Infrastructure.Repository;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Service
{
    public class BranchService : IBranchService
    {
        private readonly IBranchRepository _repository;
        private readonly ILogger _logger;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;

        public BranchService(IBranchRepository repository,
            ILogger logger, string privateSecretKey, string tokenValidationMinutes)
        {
            _repository = repository;
            _logger = logger;
            _privateSecretKey = privateSecretKey;
            _tokenValidationMinutes = tokenValidationMinutes;
        }

        public Branch Create(CreateBranchRequest branch)
        {
            try
            {

                var postBranchResponse = _repository.Create(branch);
                if (postBranchResponse == null) throw new Exception("");
                return postBranchResponse;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Branch Update(Branch branch)
        {
            try
            {
                string branchId = branch.Branch_id.ToString();
                var existingBranchResponse = _repository.GetBranchById(branchId);
                if (existingBranchResponse != null)
                {
                    return _repository.Update(branch);
                   
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return null;
        }

        public bool Delete(List<Guid> id)
        {
            try
            {
                var response = _repository.Delete(id);
                return response;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<Branch> GetBranchs()
        {
            try
            {
                return _repository.GetBranchs();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Branch> GetBranchsByPartnerId(Guid partner_id)
        {
            try
            {
                return _repository.GetBranchsByPartnerId(partner_id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ListBranchResponse ListBranchsByPartnerId(Guid partner_id, Filter filter)
        {
            try
            {
                var List =  _repository.ListBranchsByPartnerId(partner_id, filter);

                switch (List)
                {

                    case var _ when List == null:
                        throw new Exception("");
                    default: return List;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DetailsBranch ListDetailsBranch(Guid branch_id, Filter filters)
        {
            try
            {
                var response = _repository.ListDetailsBranch(branch_id, filters);

                switch (response)
                {

                    case var _ when response == null:
                        throw new Exception("errorListingDetailsBranch");
                    default: return response;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
