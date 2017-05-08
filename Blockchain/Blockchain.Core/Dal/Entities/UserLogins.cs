using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class UserLogins
    {
        [Key]
        public int Id { get; set; }
        public long UserId { get; set; }
        public string SessionId { get; set; }
        public DateTime ExpiryTime { get; set; }

        public int DebugFlag { get; set; }
    }
}
