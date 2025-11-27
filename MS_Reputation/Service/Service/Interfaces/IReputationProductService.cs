using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Model;

namespace Application.Service.Interfaces
{
    public interface IReputationProductService
    {
        RatingResponse CreateRating(CreateRatingRequest createRatingRequest);
        List<RatingResponse> GetRating(Guid branch_id);
        RatingResponse GetRatingBranchByConsumerId(Guid branch_id, Guid consumer_id);
    }
}
