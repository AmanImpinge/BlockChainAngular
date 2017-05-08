using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Items : UpdateItem
    {
        public string WorldName { get; set; }
        public string UserName { get; set; }
        public string Status { get; set; }
    }

    public class CreateItem
    {
        [Required]
        public int ItemWorldID { get; set; }

        /// <summary>
        /// vendor id
        /// </summary>
        public long UserId { get; set; }

        [Required]
        public int ItemDeliveryMode { get; set; }

        [Required]
        public int ItemCategory { get; set; }

        [Required]
        public string ItemName { get; set; }

        public string ItemDesc { get; set; }

        public int ItemQtyLimit { get; set; }

        public int ItemCost { get; set; }

        public int ItemStatus { get; set; }

        public int DebugFlag { get; set; }

        public string Image { get; set; }
        public byte[] ImageName { get; set; }
    }

    public class UpdateItem : CreateItem
    {
        public long ItemID { get; set; }
    }
}
