using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class ActivityList
    {
        [Key]
        public long ActID { get; set; }

        public int ActWorldID { get; set; }

        public int ActType { get; set; }

        public int ActTriggerFlags { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string ActName { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string ActDesc { get; set; }

        //[StringLength(36)]
        //[Column(TypeName = "varchar")]
        //[Required]
        //public string ActImageName { get; set; }

        public string ImageMimetype { get; set; }
        public byte[] Image { get; set; }


        public int ActBadgeID { get; set; }

        public int ActCurrencyValue { get; set; }
        public int ActExperiencePts { get; set; }


        public int ActMaxCount { get; set; }

        public int ActCurrencyDelta { get; set; }

        public int ActExperienceDelta { get; set; }

        public DateTime ActCreateTime { get; set; }

        public DateTime ActStartTime { get; set; }

        public DateTime ActEndTime { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        [Required]
        public string ActQRCodeVal { get; set; }

        public int ActDeleted { get; set; }

        public int ActDebug { get; set; }

        public long EventId { get; set; }

        public string Location { get; set; }
    }
}
