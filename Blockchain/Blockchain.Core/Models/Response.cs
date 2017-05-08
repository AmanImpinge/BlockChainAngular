using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Response : BaseResponse
    {
        public long Id { get; set; }
    }

    public class BaseResponse
    {
        public string Message { get; set; }

    }
}
