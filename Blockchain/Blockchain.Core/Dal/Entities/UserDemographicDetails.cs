using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class UserDemographicDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long UDID { get; set; } // user id of AppUsers table.

        public int UDGender { get; set; }

        public int UDBirthYear { get; set; }

        public int DebugFlag { get; set; }
    }
}
