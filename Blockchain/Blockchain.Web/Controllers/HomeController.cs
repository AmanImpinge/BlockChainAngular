using Blockchain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Blockchain.Web.Controllers
{
    //[Authorize]

    public class HomeController : Controller
    {
       


        // GET: Home
        public ActionResult Index()
        {
            //var db = new BlockchainContext();

            //AppleProductIDs obj = new AppleProductIDs() { Id = 1, AppleProductID = "", CurrencyValue = 2 };

            //db.AppleProductIDs.Add(obj);
            //db.SaveChanges();
            return View();
        }

        public ActionResult AngularTest()
        {
            ViewBag.testId = "123123123";
            return View();
        }
        //public ActionResult Login()
        //{
        //    return View();
        //}
        //public ActionResult Register()
        //{
        //    return View();
        //}

        public ActionResult Unauthorized()
        {
            return View();
        }
    }
}