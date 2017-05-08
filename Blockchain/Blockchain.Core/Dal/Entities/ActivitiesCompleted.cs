using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class ActivitiesCompleted
    {
        public long ACIndex { get; set; }

        [Key]
        [Column(Order = 0)]
        public int ACID { get; set; }

        [Key]
        [Column(Order = 1)]
        public long ACUserID { get; set; }

        public int ACWorldID { get; set; }

        public int ACRepeatCount { get; set; }

        public int ACValue { get; set; }

        public decimal ACPctComplete { get; set; }

        public DateTime ACDate { get; set; }

        public long ACOtherUserID { get; set; }

        public int ACExperiencePts { get; set; }

        public int ACCurrency { get; set; }

        public int ACDeleted { get; set; }

        public int DebugFlag { get; set; }
    }
}
