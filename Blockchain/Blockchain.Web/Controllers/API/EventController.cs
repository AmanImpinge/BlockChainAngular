using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using Blockchain.Repository;
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
    [RoutePrefix("api/Event")]
    public class EventController : BaseController
    {
        RepositoryFactory _repo;
        BlockchainContext _db = new BlockchainContext();

        public EventController()
        {
            _repo = new RepositoryFactory();
        }
        [HttpGet]
        [Route("GetEvents")]
        [ResponseType(typeof(GenericResponse<List<EventModel>>))]
        public async Task<IHttpActionResult> GetEvents()
        {
            var data = await _repo.Event.GetEvents();
            return Ok(data);
        }

        [HttpPost]
        [Route("SaveEvent")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> SaveEvent(CreateEvent model)
        {
            _repo.Event.SessionKey = GetLogedInSessionId();
            var data = await _repo.Event.SaveEvent(model);
            return Ok(data);
        }

        [HttpPost]
        [Route("UpdateEvent")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateEvent(UpdateEvent model)
        {
            _repo.Event.SessionKey = GetLogedInSessionId();
            var data = await _repo.Event.UpdateEvent(model);
            return Ok(data);
        }

        [HttpGet]
        [Route("GetEvent/{eventId}")]
        [ResponseType(typeof(GenericResponse<List<EventModel>>))]
        public async Task<IHttpActionResult> GetEvents(long eventId)
        {
            var data = await _repo.Event.GetEvent(eventId);
            return Ok(data);
        }

        [HttpPost]
        [Route("DeleteEvent/{eventId}")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> DeleteEvent(long eventId)
        {
            var data = await _repo.Event.DeleteEvent(eventId);
            return Ok(data);
        }
    }
}
