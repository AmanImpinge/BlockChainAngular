using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class ActivitiesCompletedModel
    {
        public string UserName { get; set; }
        public decimal TotalPoints { get; set; }
        public long ACIndex { get; set; }

        public byte[] ProfilePic { get; set; }

        public string ProfilePicMimeType { get; set; }


        public int ACID { get; set; }
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
