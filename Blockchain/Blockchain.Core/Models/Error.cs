using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Error
    {
        public int ErrorCode { get; set; }
        public string QualifierCode { get; set; }
        public string Message { get; set; }
    }
}
