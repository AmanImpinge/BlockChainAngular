using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class BadgeList
    {
        [Key]
        public int BadgeID { get; set; }

        public int BadgeWorldID { get; set; }

        public int BadgeType { get; set; }

        public int BadgeModifier { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string BadgeName { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string BadgeDesc { get; set; }

        public string ImageMimetype { get; set; }
        public byte[] Image { get; set; }

        public int BadgeDeleted { get; set; }

        public int BadgeDebug { get; set; }
    }
}
