using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class World
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string WorldName { get; set; }

        public string Description { get; set; }

        public DateTime WorldCreateTime { get; set; }

        public DateTime? WorldChangeTime { get; set; }

        public int WorldDeleted { get; set; }

        public int WorldDebugFlag { get; set; }

        public long CreatedBy { get; set; }

        public long? UpdatedBy { get; set; }

        public long WorldId { get; set; }
    }
}
