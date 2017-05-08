using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class BadgesEarned
    {
        public long BEIndex { get; set; }

        [Key]
        [Column(Order=0)]
        public int BEBadgeID { get; set; }

        [Key]
        [Column(Order = 1)]
        public long BEUserID { get; set; }

        public int BEWorldID { get; set; }

        public int BERepeatCount { get; set; }

        public int BEValue { get; set; }

        public decimal BEPctComplete { get; set; }

        public DateTime BEDate { get; set; }

        public long BEActivityID { get; set; }

        public long BESendingUserID { get; set; }

        public long BEOtherUserID { get; set; }

        public int BEExperiencePts { get; set; }

        public int BECurrency { get; set; }

        public int BEDeleted { get; set; }

        public int DebugFlag { get; set; }
    }
}
