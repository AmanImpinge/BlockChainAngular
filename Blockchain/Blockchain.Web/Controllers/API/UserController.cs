using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
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
    [RoutePrefix("api/User")]
    public class UserController : BaseController
    {
        RepositoryFactory _repo;
        public UserController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpGet]
        [Route("GetUserPrefs")]
        [ResponseType(typeof(GenericResponse<UserPrefs>))]
        public async Task<IHttpActionResult> UserPrefs()
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.GetUserPrefs();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetUserPurchases")]
        [ResponseType(typeof(GenericResponse<InAppPurchases>))]
        public async Task<IHttpActionResult> GetUserPurchases()
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.GetUserPurchases();
            return Ok(result);
        }

        [HttpPost]
        [Route("GenerateQRCode/{targetuserID}")]
        [ResponseType(typeof(GenericResponse<string>))]
        public async Task<IHttpActionResult> GenerateQRCode(int targetuserID)
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.GenerateQRCode(targetuserID);
            return Ok(result);
        }

        [HttpGet]
        [Route("ScanQRCodeForUser/{userId}")]
        [ResponseType(typeof(GenericResponse<AppUserDetails>))]
        public async Task<IHttpActionResult> ScanQRCodeForUser(long userId)
        {
            var result = await _repo.User.ScanQRCodeForUser(userId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetDirectory")]
        [ResponseType(typeof(GenericResponse<ProfileListResponse>))]
        public async Task<IHttpActionResult> GetDirectory()
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.GetDirectory();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetLeaderBoard")]
        [ResponseType(typeof(GenericResponse<AppUsers>))]
        public async Task<IHttpActionResult> GetLeaderBoard()
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.GetLeaderBoard();
            return Ok(result);
        }


        [HttpGet]
        [Route("GetLeaderBoardByEventId/{eventId}")]
        [ResponseType(typeof(GenericResponse<ActivitiesCompletedModel>))]
        public async Task<IHttpActionResult> GetLeaderBoardByEventId(int eventId)
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.GetLeaderBoardByEventId(eventId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetMarketPlaceItems")]
        [ResponseType(typeof(GenericResponse<MarketPlacetResponse>))]
        public async Task<IHttpActionResult> GetMarketPlaceItems()
        {
            var result = await _repo.User.GetMarketPlaceItems();
            return Ok(result);
        }

        [HttpPost]
        [Route("PurchaseItem/{itemId}/{qty}")]
        [ResponseType(typeof(GenericResponse<InAppPurchases>))]
        public async Task<IHttpActionResult> PurchaseItem(int itemId, int qty)
        {
            _repo.User.SessionKey = GetLogedInSessionId();
            var result = await _repo.User.PurchaseItem(itemId, qty);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAttendee")]
        [ResponseType(typeof(GenericResponse<AppUsers>))]
        public async Task<IHttpActionResult> GetAttendee()
        {
            var result = await _repo.User.GetUsersByRole(EnumUtils.AUUserClass.Standard);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetUserById/{userId}")]
        [ResponseType(typeof(GenericResponse<AppUsers>))]
        public async Task<IHttpActionResult> GetUserById(long userId)
        {
            var result = await _repo.User.GetUserById(userId);
            return Ok(result);
        }


        [HttpPost]
        [Route("DeleteUserById/{userId}")]
        [ResponseType(typeof(GenericResponse<AppUsers>))]
        public async Task<IHttpActionResult> DeleteUserById(long userId)
        {
            var result = await _repo.User.DeleteUserById(userId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetUserQRCode/{userId}")]
        [ResponseType(typeof(GenericResponse<UserQRCodeModel>))]
        public async Task<IHttpActionResult> GetUserQRCode(long userId)
        {
            var result = await _repo.User.GetUserQRCode(userId);
            return Ok(result);
        }

        [HttpPost]
        [Route("ChangeUserStatus/{userId}/{status}")]
        [ResponseType(typeof(GenericResponse<UserQRCodeModel>))]
        public async Task<IHttpActionResult> ChangeUserStatus(long userId, int status)
        {
            var result = await _repo.User.ChangeUserStatus(userId, (EnumUtils.AUAcctStatus)status);
            return Ok(result);
        }

        [HttpPost]
        [Route("UpdateUserProfile")]
        [ValidateModel]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateUserProfile(UpdateProfile register)
        {
            var Result = await _repo.User.UpdateUserProfile(register);
            return Ok(Result);
        }

        [HttpGet]
        [Route("GetOffices")]
        [ResponseType(typeof(GenericResponse<List<Offices>>))]
        public async Task<IHttpActionResult> GetOffices()
        {
            var result = await _repo.User.GetOffices();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAreas")]
        [ResponseType(typeof(GenericResponse<List<Areas>>))]
        public async Task<IHttpActionResult> GetAreas()
        {
            var result = await _repo.User.GetAreas();
            return Ok(result);
        }
    }
}
