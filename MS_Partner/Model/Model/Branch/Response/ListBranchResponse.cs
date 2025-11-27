using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class ListBranchResponse
    {
        public List<Branch> Branches { get; set; }
        public Pagination Pagination { get; set; }
    }
}
