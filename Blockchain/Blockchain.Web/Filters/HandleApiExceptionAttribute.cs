using Blockchain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;

namespace Blockchain.Web.Filters
{
    public class HandleApiExceptionAttribute : ExceptionFilterAttribute
    {
        public override async Task OnExceptionAsync(HttpActionExecutedContext actionExecutedContext, CancellationToken cancellationToken)
        {
            var request = actionExecutedContext.ActionContext.Request;
            var result = new GenericResponse<Response>();
            result.Status = "FAIL";
            result.Error = new Error
            {
                ErrorCode = Convert.ToInt32(HttpStatusCode.InternalServerError),
                Message = actionExecutedContext.Exception.Message
            };
            actionExecutedContext.Response = request.CreateResponse(HttpStatusCode.InternalServerError, result);
        }
    }
}