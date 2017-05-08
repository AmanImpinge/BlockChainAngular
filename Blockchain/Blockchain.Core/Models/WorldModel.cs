using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class WorldModel
    {
        public long Id { get; set; }

        [Required]
        public string WorldName { get; set; }

        public string Description { get; set; }

        public DateTime WorldCreateTime { get; set; }

        public DateTime? WorldChangeTime { get; set; }

        public int WorldDeleted { get; set; }

        public bool WorldDebugFlag { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
    }
}
