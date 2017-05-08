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
    [RoutePrefix("api/FAQ")]
    public class FAQController : BaseController
    {
        RepositoryFactory _repo;

        public FAQController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpPost]
        [Route("CreateFAQs")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> CreateFAQs(CreateFAQModel model)
        {
            _repo.FAQs.SessionKey = GetLogedInSessionId();
            var result = await _repo.FAQs.SaveFAQs(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("UpdateFAQs")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateFAQs(CreateFAQModel model)
        {
            _repo.FAQs.SessionKey = GetLogedInSessionId();
            var result = await _repo.FAQs.UpdateFAQs(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetFAQ/{faqId}")]
        [ResponseType(typeof(GenericResponse<CreateFAQModel>))]
        public async Task<IHttpActionResult> GetFAQ(long faqId)
        {
            _repo.FAQs.SessionKey = GetLogedInSessionId();
            var result = await _repo.FAQs.GetFAQ(faqId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetWorldFAQ/{worldId}")]
        [ResponseType(typeof(GenericResponse<CreateFAQModel>))]
        public async Task<IHttpActionResult> GetWorldFAQ(long worldId)
        {
            var result = await _repo.FAQs.GetWorldFAQ(worldId);
            return Ok(result);
        }
    }
}
