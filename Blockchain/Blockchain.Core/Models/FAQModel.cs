using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class FAQModel : CreateFAQModel
    {
        public long CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    public class CreateFAQModel
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public int Debug { get; set; }
        public int Deleted { get; set; }
        public long WorldId { get; set; }
    }
}
