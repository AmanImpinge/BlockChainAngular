using Blockchain.Web.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Blockchain.Web.Controllers
{
    public class DashBoardController : Controller
    {
        //[WebCustomAuthorize]
        public ActionResult Index()
        {
            var request = Request.Headers;
            return View();
        }
    }
}
