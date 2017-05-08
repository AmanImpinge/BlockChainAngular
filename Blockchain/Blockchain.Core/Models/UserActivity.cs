using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models.ViewModels
{
    /// <summary>
    /// User activity
    /// </summary>
    public class UserActivity
    {
        /// <summary>
        /// ActivityId
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// Name of activity
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Activity description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Start date/time
        /// </summary>
        public DateTime Start { get; set; }

        /// <summary>
        /// End date/time
        /// </summary>
        public DateTime End { get; set; }

        /// <summary>
        /// 0 - Invited, 1 - Going, 2 - Maybe, 3 - Decline
        /// </summary>
        public UserActivityStatus Status { get; set; }

        /// <summary>
        /// Short location for list
        /// </summary>
        public string LocationShort { get; set; }

        /// <summary>
        /// Detailed location
        /// </summary>
        public string LocationFull { get; set; }

        /// <summary>
        /// Earn points count
        /// </summary>
        public int Points { get; set; }

        /// <summary>
        /// Maximum points count
        /// </summary>
        public int MaximumPoints { get; set; }

        /// <summary>
        /// CountryId
        /// </summary>
        public long CountryId { get; set; }

        /// <summary>
        /// Country name
        /// </summary>
        public string ContryName { get; set; }
    }

    /// <summary>
    /// User activity status
    /// </summary>
    public enum UserActivityStatus
    {
        /// <summary>
        /// Invited
        /// </summary>
        Invited,
        
        /// <summary>
        /// Going
        /// </summary>
        Going,

        /// <summary>
        /// Maybe going
        /// </summary>
        Maybe,
        
        /// <summary>
        /// Declined
        /// </summary>
        Declined
    }

    public class FileResult
    {
        public string FileName { get; set; }

        public byte[] Content { get; set; } 
    }
}
