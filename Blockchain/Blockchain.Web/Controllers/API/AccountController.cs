using Blockchain.Core.Constants;
using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Models;
using Blockchain.Repository;
using Blockchain.Web.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace Blockchain.Web.Controllers.API
{
    [CustomAPIAuthorize]
    [RoutePrefix("api/Account")]
    public class AccountController : BaseController
    {


        RepositoryFactory _repo;
        public AccountController()
        {
            _repo = new RepositoryFactory();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<LoginResponse>))]
        public async Task<IHttpActionResult> Login(Login login)
        {
            var files = HttpContext.Current.Request.Files;
            var loginResult = await _repo.Login.LoginUser(login);
            return Ok(loginResult);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ForgotPassword")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<BaseResponse>))]
        public async Task<IHttpActionResult> ForgotPassword(ForgotPassword forgotPassword)
        {
            var Result = await _repo.Login.ForgotPassword(forgotPassword);
            return Ok(Result);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> Register(Register register)
        {
            // get guid Address value (Rico)
            var Result = await _repo.Login.RegisterUser(register);
            return Ok(Result);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("UploadUserPic")]
        public async Task<IHttpActionResult> UploadUserPic()
        {
            int iUploadedCnt = 0;
            string sPath = "";
            sPath = System.Web.HttpContext.Current.Server.MapPath("~/Pics/");
            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
            {
                System.Web.HttpPostedFile hpf = hfc[iCnt];
                if (hpf.ContentLength > 0)
                {
                    if (!File.Exists(sPath + Path.GetFileName(hpf.FileName)))
                    {
                        hpf.SaveAs(sPath + Path.GetFileName(hpf.FileName));
                        iUploadedCnt = iUploadedCnt + 1;
                    }
                }
            }
            return Ok("s");
        }

        [HttpGet]
        [Route("AppUserData")]
        [ResponseType(typeof(GenericResponse<AppUsers>))]
        public async Task<IHttpActionResult> AppUserData()
        {
            _repo.Login.SessionKey = GetLogedInSessionId();
            var AppUsers = await _repo.Login.GetAppUserData();
            return Ok(AppUsers);
        }

        [HttpGet]
        [Route("AppUserDetails")]
        [ResponseType(typeof(GenericResponse<AppUserDetails>))]
        public async Task<IHttpActionResult> AppUserDetails()
        {
            _repo.Login.SessionKey = GetLogedInSessionId();
            var AppUsersDetails = await _repo.Login.GetAppUserDetails();
            return Ok(AppUsersDetails);
        }


        [HttpGet]
        [Route("AppSpecificData")]
        [ResponseType(typeof(GenericResponse<AppSpecificData>))]
        public async Task<IHttpActionResult> AppSpecficData()
        {
            _repo.Login.SessionKey = GetLogedInSessionId();
            var AppSpecficdata = await _repo.Login.GetAppSpecificData();
            return Ok(AppSpecficdata);
        }

        [HttpGet]
        [Route("GetUserProfile")]
        [ResponseType(typeof(GenericResponse<AppSpecificData>))]
        public async Task<IHttpActionResult> GetUserProfile()
        {
            _repo.Login.SessionKey = GetLogedInSessionId();
            var response = await _repo.Login.GetUserProfile();
            return Ok(response);
        }

        [HttpPost]
        [Route("UpdateProfile")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateProfile(UpdateProfile register)
        {
            _repo.Login.SessionKey = GetLogedInSessionId();
            var Result = await _repo.Login.UpdateProfile(register);
            return Ok(Result);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("RefreshSessionKey")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<LoginResponse>))]
        public async Task<IHttpActionResult> RefreshSessionKey(RefreshSession session)
        {
            var result = await _repo.Login.RefreshSessionKey(session);
            return Ok(result);
        }

        [HttpPost]
        [Route("ChangePassword")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<BaseResponse>))]
        public async Task<IHttpActionResult> ChangePassword(ChangePassword changePassword)
        {
            _repo.Login.SessionKey = GetLogedInSessionId();
            var result = await _repo.Login.ChangePassword(changePassword);
            return Ok(result);
        }

    }
}
