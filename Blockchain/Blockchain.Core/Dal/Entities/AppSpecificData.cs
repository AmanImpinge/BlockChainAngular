using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class AppSpecificData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long ASID { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string ASEmployeeID { get; set; }

        public int ASAppID { get; set; }
        public DateTime ASChangeTime { get; set; }
        public int ASBizGroupID { get; set; }
        public int ASBizAreaID { get; set; }
        public int ASOfficeID { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string ASPhotoID { get; set; }
        public long ASExperiencePts { get; set; }
        public long ASFacebookID { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string ASTwitterID { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string ASLinkedInID { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string ASInstagramID { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string ASSkypeID { get; set; }
        public int ASEULAAccepted { get; set; }

        public int DebugFlag { get; set; }
    }
}
