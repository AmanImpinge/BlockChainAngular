using Blockchain.Core.Models;
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
    [RoutePrefix("api/Reward")]
    [CustomAPIAuthorize]
    public class RewardController : BaseController
    {
        RepositoryFactory _repo;

        public RewardController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpPost]
        [Route("IssueReward")]
        [ResponseType(typeof(GenericResponse<IssueRewardResponse>))]
        public async Task<IHttpActionResult> IssueReward(IssueRewardRequest issueReward)
        {
            _repo.Reward.SessionKey = GetLogedInSessionId();
            var response = await _repo.Reward.IssueReward(issueReward);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBalance/{targetUserId}")]
        [ResponseType(typeof(GenericResponse<BalanceRewardResponse>))]
        public async Task<IHttpActionResult> GetBalance(long targetUserId)
        {
            _repo.Reward.SessionKey = GetLogedInSessionId();
            var response = await _repo.Reward.GetBalance(targetUserId);
            return Ok(response);
        }

        [ValidateModel]
        [HttpPost]
        [Route("TransferBalance")]
        [ResponseType(typeof(GenericResponse<IssueRewardResponse>))]
        public async Task<IHttpActionResult> TransferBalance(TransferMoney request)
        {
            _repo.Reward.SessionKey = GetLogedInSessionId();
            var response = await _repo.Reward.TransferBalance(request);
            return Ok(response);
        }

        /// <summary>
        /// API to get balance from database(Not using loyyal api /balance call).
        /// </summary>
        /// <param name="targetUserId">user id to get balance</param>
        /// <returns>GenericResponse<BalanceRewardResponse></returns>
        [HttpGet]
        [Route("GetBalanceDB/{targetUserId}")]
        [ResponseType(typeof(GenericResponse<BalanceRewardResponse>))]
        public async Task<IHttpActionResult> GetBalanceDB(long targetUserId)
        {
            _repo.Reward.SessionKey = GetLogedInSessionId();
            var response = await _repo.Reward.GetBalanceDB(targetUserId);
            return Ok(response);
        }
    }
}
