using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class ItemCatalog
    {
        
        //[Column(Order = 0)]
       // [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ItemID { get; set; }

        public int ItemWorldID { get; set; }

        public long UserId { get; set; }

        //[Key]
        //[Column(Order = 1)]
        public int ItemAppCode { get; set; }

        public int ItemDeliveryMode { get; set; }
        public int ItemCategory { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        [Required]
        public string ItemName { get; set; }

        [StringLength(64)]
        [Column(TypeName = "varchar")]
        [Required]
        public string ItemDesc { get; set; }

        public int ItemQtyLimit { get; set; }
        public int ItemCost { get; set; }





        public string ThumbnailMimetype { get; set; }


        public byte[] Thumbnail { get; set; }


        public string ImageMimetype { get; set; }


        public byte[] Image { get; set; }


   

        public int ItemUnlockItemID { get; set; }

        public int ItemUnlockUserClass { get; set; }

        [StringLength(6)]
        [Column(TypeName = "char")]
        public string ItemUnlockUserAchieveID { get; set; }

        public int ItemIsDefault { get; set; }

        public int ItemStatus { get; set; }

        public int DebugFlag { get; set; }
    }
}
