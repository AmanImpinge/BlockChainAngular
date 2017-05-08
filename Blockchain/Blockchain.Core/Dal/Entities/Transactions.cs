using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class Transactions
    {
        [Key]
        public long TransID { get; set; }
        public int TransWorldID { get; set; }
        public long TransUserID { get; set; }
        public long TransRecipientID { get; set; }
        public int TransAmount { get; set; }
        public DateTime TransDate { get; set; }
        public int TransStatusCode { get; set; }
        public int TransItemID { get; set; }
        public string Trans_BCtransactionHash { get; set; }
        public string Trans_BCaddress { get; set; }
        public int TransDebug { get; set; }
    }
}
