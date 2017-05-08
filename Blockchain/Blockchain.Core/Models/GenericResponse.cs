using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class GenericResponse<T>
    {
        public T Data { get; set; }

        public string Status { get; set; }

        public Error Error { get; set; }
    }
}
