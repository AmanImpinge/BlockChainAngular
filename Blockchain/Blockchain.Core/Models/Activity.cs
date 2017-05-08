using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Activity
    {
        public long ActID { get; set; }
        [Required]
        public string ActName { get; set; }
        [Required]
        public string ActDesc { get; set; }
        public int ActCurrencyValue { get; set; }
        public int ActType { get; set; }
        public int ActMaxCount { get; set; }
        public int ActWorldID { get; set; }
        public string Image { get; set; }
        public bool ActDebug { get; set; }
        public int ActCurrencyDelta { get; set; }
        public int ActExperienceDelta { get; set; }
        public string ActQRCodeVal { get; set; }
        public int ActTriggerFlags { get; set; }
        public DateTime ActStartTime { get; set; }
        public DateTime ActEndTime { get; set; }

        public string FormattedActStartTime { get; set; }
        public string FormattedActEndTime { get; set; }
        public long EventId { get; set; }
        public string Location { get; set; }
    }

    public class ActivityData
    {
        public long ActID { get; set; }
        public string ActWorld { get; set; }
        public string ActType { get; set; }
        public int ActTriggerFlags { get; set; }
        public string ActName { get; set; }
        public string ActDesc { get; set; }
        // public string ActImageName { get; set; }
        public string ImageMimetype { get; set; }
        public byte[] Image { get; set; }
        public int ActCurrencyValue { get; set; }
        public int ActMaxCount { get; set; }
        public int ActCurrencyDelta { get; set; }
        public string ActQRCodeVal { get; set; }
        public int ActDebug { get; set; }
        public string EventName { get; set; }

        public DateTime ActStartTime { get; set; }
        public DateTime ActEndTime { get; set; }
        public string Location { get; set; }
    }

    public class ActivityDetails : Activity
    {
        public string WorldName { get; set; }
        public byte[] ImageData { get; set; }
        public string ImageMimetype { get; set; }
        public string Image { get; set; }
        public string EventName { get; set; }
    }
}
