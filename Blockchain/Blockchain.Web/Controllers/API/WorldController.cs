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
    [RoutePrefix("api/World")]
    public class WorldController : BaseController
    {
        RepositoryFactory _repo;
        public WorldController()
        {
            _repo = new RepositoryFactory();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetWorlds")]
        [ResponseType(typeof(GenericResponse<List<World>>))]
        public async Task<IHttpActionResult> GetWorlds()
        {
            var result = await _repo.World.GetWorlds();
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateWorld")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> CreateWorld(WorldModel world)
        {
            _repo.World.SessionKey = GetLogedInSessionId();
            var result = await _repo.World.CreateWorld(world);

            return Ok(result);
        }

        [HttpPost]
        [Route("UpdateWorld")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateWorld(WorldModel world)
        {
            _repo.World.SessionKey = GetLogedInSessionId();
            var result = await _repo.World.UpdateWorld(world);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetWorld/{id}")]
        [ResponseType(typeof(GenericResponse<World>))]
        public async Task<IHttpActionResult> GetWorld(long id)
        {
            var result = await _repo.World.GetWorld(id);
            return Ok(result);
        }
    }
}
