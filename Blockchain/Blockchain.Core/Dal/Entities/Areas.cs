using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.Entities
{
    public class Areas
    {
        [Key]
        public int BizAreaID { get; set; }
        public string AreaName { get; set; }
    }
}
