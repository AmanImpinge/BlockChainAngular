using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class NewsFeed
    {
        [Key]
        public int MsgID { get; set; }

        public int MsgAppID { get; set; }

        public int MsgWorldID { get; set; }

        public DateTime MsgStartTime { get; set; }

        public DateTime MsgExpireTime { get; set; }

        public int MsgType { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgTitle { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgBody { get; set; }

        public int MsgPriority { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgButtonTitle1 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgButtonURL1 { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgButtonTitle2 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgButtonURL2 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgInfoURL1 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgInfoURL2 { get; set; }

        [StringLength(255)]
        [Column(TypeName = "varchar")]
        [Required]
        public string MsgInfoURL3 { get; set; }

        public int MsgFlags { get; set; }

        [StringLength(2)]
        [Column(TypeName = "char")]
        [Required]
        public string MsgLanguageCode { get; set; }

        public int DebugFlag { get; set; }
    }
}
