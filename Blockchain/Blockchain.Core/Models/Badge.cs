using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Badge:UpdateBadge
    {
        //public string WorldName { get; set; }
        //public string BadgeType { get; set; }
        //public string BadgeModifier { get; set; }
    }

    public class CreateBadge
    {
        [Required]
        public int BadgeWorldID { get; set; }
        public int BadgeType { get; set; }
        public int BadgeModifier { get; set; }
        public string BadgeName { get; set; }
        public string BadgeDesc { get; set; }
        public string Image { get; set; }
        public int BadgeDeleted { get; set; }
        public int BadgeDebug { get; set; }
    }

    public class UpdateBadge : CreateBadge
    {
        public long BadgeID { get; set; }
    }

    public class BadgeData
    {
        public int BadgeID { get; set; }
        public string BadgeWorldID { get; set; }
        public int BadgeType { get; set; }
        public int BadgeModifier { get; set; }

        public string BadgeTypeView { get; set; }
        public string BadgeModifierView { get; set; }


        public string BadgeName { get; set; }
        public string BadgeDesc { get; set; }
        public string ImageMimetype { get; set; }
        public byte[] Image { get; set; }
        public int BadgeDeleted { get; set; }
        public int BadgeDebug { get; set; }
    }
}
