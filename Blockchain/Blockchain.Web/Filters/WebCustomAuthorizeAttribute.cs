using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Blockchain.Web.Filters
{
    public class WebCustomAuthorizeAttribute : AuthorizeAttribute
    {
        //For handle single role
        public string Role = string.Empty;

        public override void OnAuthorization(AuthorizationContext actionContext)
        {
            if (!SkipAuthorization(actionContext))
            {
                var sessionId = actionContext.HttpContext.Request.Headers.Get("SessionId");
                if (string.IsNullOrEmpty(sessionId))
                {
                    RedirectToLogin(actionContext);
                }

                bool validate = true; //To Do : Validate SessionId from the database.
                if (!validate)
                {
                    RedirectToLogin(actionContext);
                }
            }
        }

        public void RedirectToLogin(AuthorizationContext filterContext)
        {
            filterContext.Result =
                new RedirectToRouteResult(new RouteValueDictionary(
                    new
                    {
                        controller = "Home",
                        action = "Unauthorized",
                        area = "",
                        returnUrl = filterContext.RequestContext.HttpContext.Request.Url.PathAndQuery
                    }));
        }

        private bool SkipAuthorization(AuthorizationContext filterContext)
        {
            Contract.Assert(filterContext != null);

            return filterContext.ActionDescriptor.GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Any()
                   || filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Any();
        }
    }
}