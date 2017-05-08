using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Models;
using Blockchain.Repository;
using Blockchain.Web.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Blockchain.Web.Controllers.API
{
    [CustomAPIAuthorize]
    [RoutePrefix("api/Activity")]
    public class ActivityController : BaseController
    {
        RepositoryFactory _repo;
        public ActivityController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpGet]
        [Route("GetActivityList")]
        [ResponseType(typeof(GenericResponse<List<ActivityList>>))]
        public async Task<IHttpActionResult> GetActivityList()
        {
            var result = await _repo.Activity.GetActivities();
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveActivity")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<List<Response>>))]
        public async Task<IHttpActionResult> SaveActivity(Activity activity)
        {
            var Result = await _repo.Activity.SaveActivity(activity);
            return Ok(Result);
        }

        [HttpPost]
        [Route("DeleteActivityById/{ActivityId}")]
        [ResponseType(typeof(GenericResponse<ActivityList>))]
        public async Task<IHttpActionResult> DeleteActivityById(long ActivityId)
        {
            var result = await _repo.Activity.DeleteActivityById(ActivityId);
            return Ok(result);
        }

        [HttpPost]
        [Route("UpdateActivity")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<List<Response>>))]
        public async Task<IHttpActionResult> UpdateActivity(Activity activity)
        {
            var Result = await _repo.Activity.UpdateActivity(activity);
            return Ok(Result);
        }

        [HttpGet]
        [Route("ActivityDetails/{id}")]
        [ResponseType(typeof(GenericResponse<ActivityList>))]
        public async Task<IHttpActionResult> ActivityDetails(long id)
        {
            var result = await _repo.Activity.ActivityDetails(id);
            return Ok(result);
        }


        [HttpPost]
        [Route("CopyActivity")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<List<Response>>))]
        public async Task<IHttpActionResult> CopyActivity(Activity activity)
        {
            var Result = await _repo.Activity.CopyActivity(activity);
            return Ok(Result);
        }
    }
}
