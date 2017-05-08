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
    [RoutePrefix("api/Transaction")]
    [CustomAPIAuthorize]
    public class TransactionController : BaseController
    {
        RepositoryFactory _repo;

        public TransactionController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpGet]
        [Route("GetUserTransactions/{userId}")]
        [ResponseType(typeof(GenericResponse<TransactionsModel>))]
        public async Task<IHttpActionResult> GetUserTransactions(long userId)
        {
            var response = await _repo.Transaction.GetUserTransactions(userId);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllTransactions")]
        [ResponseType(typeof(GenericResponse<TransactionsModel>))]
        public async Task<IHttpActionResult> GetAllTransactions()
        {
            var response = await _repo.Transaction.GetAllTransactions();
            return Ok(response);
        }
    }
}
