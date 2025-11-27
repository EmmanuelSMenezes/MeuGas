using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class ListActuationArea
    {
        public List<ActuationArea> Actuation_areas {  get; set; }
        public Pagination Pagination { get; set; }
    }
}
