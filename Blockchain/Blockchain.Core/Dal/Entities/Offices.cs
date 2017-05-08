using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class Offices
    {
        [Key]
        public int ASOfficeID { get; set; }
        public string OfficeName { get; set; }
    }
}
