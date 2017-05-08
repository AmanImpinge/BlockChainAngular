using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class PrivacyNotes
    {
        [Key]
        public long Id { get; set; }
        public string Text { get; set; }
        public int Debug { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int Deleted { get; set; }
        public long WorldId { get; set; }
    }
}
