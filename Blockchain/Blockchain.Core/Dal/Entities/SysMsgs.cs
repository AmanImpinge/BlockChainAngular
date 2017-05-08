using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class SysMsgs
    {
        [Key]
        public int SMsgID { get; set; }

        [StringLength(3)]
        [Column(TypeName = "char")]
        [Required]
        public string SMsgAppID { get; set; }

        public int SMsgWorldID { get; set; }

        public DateTime SMsgStartTime { get; set; }

        public DateTime SMsgExpireTime { get; set; }

        public int SMsgType { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgTitle { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgBody { get; set; }

        public int SMsgPriority { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgButtonTitle1 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgButtonURL1 { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgButtonTitle2 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgButtonURL2 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgInfoURL1 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgInfoURL2 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string SMsgInfoURL3 { get; set; }
        
        public int SMsgFlags { get; set; }

        [StringLength(2)]
        [Column(TypeName = "char")]
        [Required]
        public string SMsgLanguageCode { get; set; }

        public int DebugFlag { get; set; }
    }
}
