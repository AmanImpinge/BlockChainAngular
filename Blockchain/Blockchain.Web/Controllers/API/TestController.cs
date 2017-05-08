using Blockchain.Core.Constants;
using Blockchain.Core.Models;
using Blockchain.Web.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Blockchain.Web.Controllers.API
{
    public class TestController : ApiController
    {
        [CustomAPIAuthorize]
        //[AllowAnonymous]
        public IHttpActionResult GetData()
        {
            GenericResponse<BaseResponse> response = new GenericResponse<BaseResponse>();
            response.Status = Messages.Ok;
            response.Data = new BaseResponse
            {
                Message = Messages.Success
            };
            return Ok(response);
        }
    }
}
