using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Reward
    {
    }

    public class CreateRewardResponse
    {
        public string TransactionHash { get; set; }
        public string Address { get; set; }
    }

    public class IssueRewardRequest
    {
        public long TargetUserId { get; set; }
        public int Amount { get; set; }
    }

    public class IssueRewardResponse
    {
        public string TxHash { get; set; }
    }

    public class BalanceRewardResponse
    {
        public int Balance { get; set; }
    }

    public class TransferMoney
    {
        public long UserId { get; set; }
        public long TargetUserId { get; set; }
        public int Amount { get; set; }
    }
}
