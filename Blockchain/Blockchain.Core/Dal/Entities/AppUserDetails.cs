using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class AppUserDetails
    {
        //user Id
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long ADID { get; set; }

        public int ADUserLevel { get; set; }

        public DateTime ADChangeTime { get; set; }

        public int ADLastNewsIndex { get; set; }

        public int ADLastSysMsgIndex { get; set; }

        [StringLength(2)]
        [Column(TypeName = "char")]
        public string ADLanguageCode { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        public string ADNamePrefix { get; set; }

        [StringLength(32)]
        [Column(TypeName = "varchar")]
        public string ADNameDesc { get; set; }

        public DateTime ADLastPlayTime { get; set; }

        public int ADCurrencyAvail { get; set; }

        public int ADCurrencyTotal { get; set; }

        [StringLength(36)]
        [Column(TypeName = "varchar")]
        [Required]
        public string ADQRCodeVal { get; set; }

        public int DebugFlag { get; set; }
    }
}
