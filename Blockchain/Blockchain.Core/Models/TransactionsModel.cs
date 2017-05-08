using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class TransactionsModel : CreateTransaction
    {
        public string RecipientName { get; set; }
        public string TransUserName { get; set; }
        public string WorldName { get; set; }
        public string TransStatus { get; set; }
        public string TransFormattedDate { get; set; }

        public string Type { get; set; }
    }

    public class CreateTransaction
    {
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
