using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class AppleProductIDs
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [StringLength(64)]
        [Column(TypeName = "varchar")]
        [Required]
        public string AppleProductID { get; set; }

        public int CurrencyValue { get; set; }

        public int DebugFlag { get; set; }
    }
}
