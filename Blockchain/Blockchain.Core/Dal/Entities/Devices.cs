using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class Devices
    {
        [Key]
        public long Id { get; set; }

        public long DevUserID { get; set; }//user id

        [StringLength(64)]
        [Column(TypeName = "varchar")]
        [Required]
        public string DevToken { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string DevName { get; set; }
        public int DevType { get; set; }
        public DateTime DevCreateTime { get; set; }
        public int DevStatus { get; set; }

        public int DebugFlag { get; set; }
    }
}
