using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class EventModel : UpdateEvent
    {
        public int Deleted { get; set; }

        public long CreatedBy { get; set; }

        public DateTime CreateOn { get; set; }

        public string FormattedCreateOn { get; set; }

        public long? UpdatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }
    }

    public class CreateEvent
    {
        [Required]
        public string EventName { get; set; }

        public string Description { get; set; }

        public int DebugFlag { get; set; }

        public long WorldId { get; set; }
    }

    public class UpdateEvent : CreateEvent
    {
        public long Id { get; set; }
    }
}
