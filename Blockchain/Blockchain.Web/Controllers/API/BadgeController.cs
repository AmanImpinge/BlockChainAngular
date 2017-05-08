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
    [RoutePrefix("api/Badge")]
    public class BadgeController : BaseController
    {
        RepositoryFactory _repo;

        public BadgeController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpGet]
        [Route("GetBadges")]
        [ResponseType(typeof(GenericResponse<List<Badge>>))]
        public async Task<IHttpActionResult> GetBadges()
        {
            var result = await _repo.Badge.GetBadges();
            return Ok(result);
        }
        [HttpPost]
        [Route("CreateBadge")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> CreateBadge(CreateBadge badge)
        {
            var data = await _repo.Badge.CreateBadge(badge);
            return Ok(data);
        }
        [HttpPost]
        [Route("UpdateBadge")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateBadge(UpdateBadge badge)
        {
            var result = await _repo.Badge.UpdateBadge(badge);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetBadge/{BadgeID}")]
        [ResponseType(typeof(GenericResponse<Items>))]
        public async Task<IHttpActionResult> GetBadge(long BadgeID)
        {
            var result = await _repo.Badge.GetBadge(BadgeID);
            return Ok(result);
        }


        [HttpPost]
        [Route("DeleteBadgeById/{BadgeID}")]
        [ResponseType(typeof(GenericResponse<Items>))]
        public async Task<IHttpActionResult> DeleteBadgeById(long BadgeID)
        {
            var result = await _repo.Badge.DeleteBadgeById(BadgeID);
            return Ok(result);
        }

    }
}