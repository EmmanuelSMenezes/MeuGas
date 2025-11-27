using System;
using System.Collections.Generic;
using Domain.Model;

namespace Infrastructure.Repository
{
  public interface IReputationProductRepository
  {
        RatingResponse CreateRating(CreateRatingRequest createCategoryRequest);
        List<RatingResponse> GetRating(Guid partner_id);
        RatingResponse GetRatingBranchByConsumerId(Guid branch_id, Guid consumer_id);
    }
}
