using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class Events
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string EventName { get; set; }

        public string Description { get; set; }

        public int Deleted { get; set; }

        public int DebugFlag { get; set; }

        public long CreatedBy { get; set; }

        public DateTime CreateOn { get; set; }

        public long? UpdatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public long WorldId { get; set; }
    }
}
