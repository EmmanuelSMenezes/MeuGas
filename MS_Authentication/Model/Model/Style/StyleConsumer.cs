using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Domain.Model
{
    public class StyleConsumer
    {
        public Colors colors { get; set; }
        public Fonts fonts { get; set; }
    }

    public class Colors
    {

        public string primary { get; set; }
        public string text { get; set; }
        public string primaryBackground { get; set; }
        public string secondary { get; set; }
        public string black { get; set; }
        public string gray { get; set; }
        public string lightgray { get; set; }
        public string white { get; set; }
        public string background { get; set; }
        public string shadow { get; set; }
        public string shadowPrimary { get; set; }
        public string success { get; set; }
        public string danger { get; set; }
        public string warning { get; set; }
        public string blue { get; set; }
        public string shadowBlue { get; set; }
        public string gold { get; set; }
        public string orange { get; set; }

    }
    public class Fonts
    {
        public string light_italic { get; set; }
        public string light { get; set; }
        public string italic { get; set; }
        public string regular { get; set; }
        public string medium { get; set; }
        public string bold { get; set; }
    }
}
