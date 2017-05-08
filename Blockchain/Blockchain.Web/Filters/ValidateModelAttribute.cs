using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Net;
using System.Net.Http;
using Blockchain.Core.Models;

namespace Blockchain.Web.Filters
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutingAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            var result = new GenericResponse<Response>();
            if (actionContext.ModelState.IsValid == false)
            {
                var errors = new List<string>();
                foreach (var state in actionContext.ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        if (!string.IsNullOrEmpty(error.ErrorMessage))
                            errors.Add(error.ErrorMessage);
                    }
                }

                if (errors.Any())
                {
                    result.Error = new Error
                    {
                        Message = string.Join(",", errors)
                    };
                    result.Status = "FAIL";
                }

                actionContext.Response = actionContext.Request.CreateResponse(
                    HttpStatusCode.BadRequest, result);
            }
        }
    }
}