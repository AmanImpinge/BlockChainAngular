using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
using Blockchain.Repository;
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
    [RoutePrefix("api/Admin")]
    public class AdminController : BaseController
    {
        RepositoryFactory _repo;
        BlockchainContext _db = new BlockchainContext();

        public AdminController()
        {
            _repo = new RepositoryFactory();
        }
        [HttpGet]
        [Route("GetUserList")]
        [ResponseType(typeof(GenericResponse<AppUsers>))]
        public async Task<IHttpActionResult> GetUserList()
        {
            var data = await _repo.User.GetUsersList();
            return Ok(data);
        }
    }
}
