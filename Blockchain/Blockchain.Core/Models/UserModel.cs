using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class UserModel
    {
        public long AUID { get; set; }
        public int AUAcctStatusId { get; set; }
        public string AUAcctStatus { get; set; }
        public string AUFirstName { get; set; }
        public string AULastName { get; set; }
        public string AUUserEmail { get; set; }
        public int AUWorldId { get; set; }
        public string AUWorld { get; set; }
        public string AUUserClass { get; set; }
        public int AUOptionFlags { get; set; }
        public string AUPrivLevel { get; set; }
        public int AUDebugFlag { get; set; }
        public string AUNickName { get; set; }
    }
}
