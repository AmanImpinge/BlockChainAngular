using Blockchain.Core.Constants;
using Blockchain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Blockchain.Web.Controllers.API
{
    public class BaseController : ApiController
    {
        protected string GetLogedInSessionId()
        {
            if (!Request.Headers.Contains("SessionId"))
            {
                GenericResponse<BaseResponse> response = new GenericResponse<BaseResponse>();
                response.Status = Messages.Fail;
                response.Error = new Error
                {
                    ErrorCode = Convert.ToInt32(HttpStatusCode.Unauthorized),
                    Message = Messages.MissingSessionId
                };
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.Unauthorized, response));
            }
            else
            {
                return Request.Headers.GetValues("SessionId").FirstOrDefault();
            }
        }
    }
}