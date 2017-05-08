using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class QRCode
    {
        public string ImageBase64String { get; set; }
        public byte[] Data { get; set; }
        public string MimeType { get; set; }
    }
}
