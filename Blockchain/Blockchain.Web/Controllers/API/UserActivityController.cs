using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Models;
using Blockchain.Core.Models.ViewModels;
using Blockchain.Core.Utils;
using Blockchain.Repository;
using Blockchain.Web.Filters;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;


namespace Blockchain.Web.Controllers.API
{
    /// <summary>
    /// User activities controler
    /// </summary>
    [CustomAPIAuthorize]
    [RoutePrefix("api/UserActivities")]
    [SuppressMessage("ReSharper", "CatchAllClause")]
    [SuppressMessage("ReSharper", "ConsiderUsingAsyncSuffix")]
    public class UserActivityController : BaseController
    {
        /// <summary>
        /// Get list of available activities for user
        /// </summary>
        /// <returns>List of user activities</returns>
        /// 
        RepositoryFactory _repo;


        public UserActivityController()
        {
            _repo = new RepositoryFactory();
        }


        [HttpGet]
        [Route("")]
        [ResponseType(typeof(GenericResponse<IEnumerable<UserActivity>>))]
        public async Task<IHttpActionResult> Get()
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var list = await _repo.UserActivity.GetActivitiesAsync();
            return Ok(list);
        }

        /// <summary>
        /// Set activity status for user
        /// </summary>
        /// <param name="activityId">Activity identifier</param>
        /// <returns></returns>
        [HttpPost]
        [Route("{activityId}")]
        [ResponseType(typeof(GenericResponse<UserActivity>))]
        public async Task<IHttpActionResult> SetStatus(int activityId)
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.UserActivity.SetActivityStatusAsync(activityId);
            return Ok(result);
        }
    }
}
