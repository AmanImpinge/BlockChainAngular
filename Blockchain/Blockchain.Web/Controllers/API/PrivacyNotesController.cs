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
    [RoutePrefix("api/PrivacyNotes")]
    public class PrivacyNotesController : BaseController
    {
        RepositoryFactory _repo;

        public PrivacyNotesController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpPost]
        [Route("CreatePrivacyNotes")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> CreatePrivacyNotes(CreatePrivacyNotes privacyNotes)
        {
            _repo.PrivacyNotes.SessionKey = GetLogedInSessionId();
            var result = await _repo.PrivacyNotes.SavePrivacyNotes(privacyNotes);
            return Ok(result);
        }

        [HttpPost]
        [Route("UpdatePrivacyNotes")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdatePrivacyNotes(CreatePrivacyNotes privacyNotes)
        {
            _repo.PrivacyNotes.SessionKey = GetLogedInSessionId();
            var result = await _repo.PrivacyNotes.UpdatePrivacyNotes(privacyNotes);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetPrivacyNote/{id}")]
        [ResponseType(typeof(GenericResponse<CreatePrivacyNotes>))]
        public async Task<IHttpActionResult> GetPrivacyNote(long id)
        {
            var result = await _repo.PrivacyNotes.GetPrivacyNote(id);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetWorldPrivacyNote/{worldId}")]
        [ResponseType(typeof(GenericResponse<CreatePrivacyNotes>))]
        public async Task<IHttpActionResult> GetWorldPrivacyNote(long worldId)
        {
            var result = await _repo.PrivacyNotes.GetWorldPrivacyNote(worldId);
            return Ok(result);
        }

    }
}
