using System.Collections.Generic;

namespace Domain.Model.Response
{
    public class ListPartnerResponse
    {
        public List<Partner> Partners { get; set; }
       public Pagination Pagination { get; set; }
    }
}