using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class InAppPurchases
    {
        [Key]
        public int IAPurchaseID { get; set; }
        public long IAUserID { get; set; }
        public int IAReceiptStatus { get; set; }
        public DateTime IAPurchaseDate { get; set; }

        [StringLength(64)]
        [Column(TypeName = "varchar")]
        [Required]
        public string IAAppleTransactID { get; set; }
        public int IAAppleStatusCode { get; set; }

        [StringLength(64)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string IAProductID { get; set; }
        public int IACurrencyValue { get; set; }

        [StringLength(4096)]
        [Column(TypeName = "varchar")]
        //[Required]
        public string IAReceiptData { get; set; }

        public int DebugFlag { get; set; }
    }
}
