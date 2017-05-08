using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class UserPrefs
    {
        /// <summary>
        /// User Id will be save here.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long UPID { get; set; }
        public int UPAllowEmail { get; set; }
        public int UPAllowPush { get; set; }
        public int UPAllowWall { get; set; }

        [StringLength(64)]
        [Column(TypeName = "varchar")]
        [Required]
        public string UPTimeZoneName { get; set; }

        public DateTime UPContactAfterWkday { get; set; }
        public DateTime UPContactBeforeWkday { get; set; }
        public DateTime UPContactAfterWkend { get; set; }
        public DateTime UPContactBeforeWkend { get; set; }

        public int DebugFlag { get; set; }
    }
}
