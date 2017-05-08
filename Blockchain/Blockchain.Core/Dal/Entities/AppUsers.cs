using Blockchain.Core.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    //: SystemInfo
    public class AppUsers
    {
        [Key]
        public long AUID { get; set; }

        public int AUWorldID { get; set; }

        [Required]
        public int AULoginTypeMask { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string AUUserName { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string AUFirstName { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string AULastName { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        public string AUNickName { get; set; }

        [StringLength(48)]
        [Column(TypeName = "varchar")]
        [Required]
        public string AUUserEmail { get; set; }

        public DateTime AUCreateTime { get; set; }

        public DateTime AUChangeTime { get; set; }

        public DateTime AUExpiresTime { get; set; }

        public int AUUserClass { get; set; }

        public int AUAcctStatus { get; set; }

        [JsonIgnore]
        [StringLength(32)]
        [Required]
        public string AUPWSalt { get; set; }

        [JsonIgnore]
        [StringLength(64)]
        [Required]
        public string AUPWHash { get; set; }

        public int AUFeatureFlags { get; set; }

        [StringLength(24)]
        [Column(TypeName = "varchar")]
        public string AUGameCenterID { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        public string AUGameCenterUserName { get; set; }

        public int AUOptionFlags { get; set; }

        public int AUPrivLevel { get; set; }

        public int AUDeleted { get; set; }

        public int AUDebugFlag { get; set; }

        public byte[] ProfilePic { get; set; }

        public string ProfilePicMimeType { get; set; }

        public string AUDcoinAddress { get; set; }
    }
}
