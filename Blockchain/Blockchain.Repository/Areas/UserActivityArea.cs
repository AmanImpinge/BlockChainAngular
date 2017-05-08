using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models.ViewModels;

namespace Blockchain.Repository.Areas
{
    /// <summary>
    /// User activities repository area
    /// </summary>
    public class UserActivityArea:RepositoryBase
    {
        readonly BlockchainContext _context = new BlockchainContext();
        long _userId;

        /// <summary>
        /// Get list of activities available for user
        /// </summary>
        /// <param name="userId">User identifier</param>
        /// <returns></returns>
        public async Task<IEnumerable<UserActivity>> GetActivitiesAsync()
        {
            _userId = GetLoginUserId();
            var random = new Random();
            return  Enumerable.Range(1, 10).Select(i =>
            {
                var world =
                    _context.Worlds.OrderBy(e => Guid.NewGuid())
                        .FirstOrDefault();

                // static value return
                return new UserActivity
                {
                    Id = i,
                    Name = "Activity {i}",
                    Description = "Description {i}",
                    Status = (UserActivityStatus) random.Next(3),
                    CountryId = world.Id,
                    ContryName = world.WorldName,
                    Points = random.Next(100),
                    MaximumPoints = random.Next(600),
                    Start = DateTime.Now.AddDays(random.Next(20)),
                    End = DateTime.Now.AddDays(random.Next(30)),
                    LocationShort = "Some location",
                    LocationFull = "Full location"
                };
            });
        }

        /// <summary>
        /// Set user activity status
        /// </summary>
        /// <param name="userId">User identifier</param>
        /// <param name="activityId">Activity identifier</param>
        /// <returns></returns>
        public async Task<UserActivity> SetActivityStatusAsync(long activityId)
        {
            _userId =  GetLoginUserId();

            // need to do

            return new UserActivity
                {
                };
        }
    }
}