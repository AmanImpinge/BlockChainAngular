using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using System.Diagnostics.Contracts;
using System.Web.Http;
using Blockchain.Core.Models;
using Blockchain.Core.Constants;
using Blockchain.Repository.Areas;

namespace Blockchain.Web.Filters
{
    public class CustomAPIAuthorizeAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// Override the OnActionExecuting method to perform check validation operation.
        /// </summary>
        /// <param name="actionContext">HttpActionContext object</param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (!SkipAuthorization(actionContext))
            {
                GenericResponse<BaseResponse> response = new GenericResponse<BaseResponse>();
                if (!actionContext.Request.Headers.Contains("SessionId"))
                {
                    var errorResponse = CreateErrorResponse(Messages.MissingSessionId);
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, errorResponse);

                    return;
                }

                var tokenValue = actionContext.Request.Headers.GetValues("SessionId").FirstOrDefault();
                var loggedInUser = new LoginArea().GetUserLoginSession(tokenValue);

                if (loggedInUser == null)
                {
                    var errorResponse = CreateErrorResponse(Messages.InvalidSessionId);
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, errorResponse);

                    return;
                }

                if (loggedInUser.ExpiryTime < DateTime.Now)
                {
                    var errorResponse = CreateErrorResponse(Messages.SessionKeyExpired);
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.BadRequest, errorResponse);

                    return;
                }
            }
        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
            Contract.Assert(actionContext != null);

            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }

        private GenericResponse<BaseResponse> CreateErrorResponse(string message)
        {
            GenericResponse<BaseResponse> response = new GenericResponse<BaseResponse>();
            response.Status = Messages.Fail;
            response.Error = new Error
            {
                ErrorCode = Convert.ToInt32(HttpStatusCode.Unauthorized),
                Message = message
            };

            return response;
        }

        //public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        //{
        //    actionExecutedContext.Response.Headers.Add("Version", "V1"); //Version number of calling application (this is a 'protocol version')
        //    //this will send client //actionExecutedContext.Response.Headers.Add("AppId", "test_app"); // Code for calling application (useful when several apps use the same server). (complete list will be available as enumerated type to client and server) 
        //    actionExecutedContext.Response.Headers.Add("Environment", "dev"); //Environment code for calling application ('dev' or 'pro'). This gets important when doing Apple Push Notifications or In-App Purchases 
        //    actionExecutedContext.Response.Headers.Add("Platform", "test_platform"); // Platform on which the client device is operating. (complete list will be available as enumerated type to client and server)
        //    base.OnActionExecuted(actionExecutedContext);
        //}
    }
}