using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
using Blockchain.Repository;
using Blockchain.Web.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Blockchain.Web.Controllers.API
{
    [CustomAPIAuthorize]
    [RoutePrefix("api/Item")]
    public class ItemController : BaseController
    {
        RepositoryFactory _repo;

        public ItemController()
        {
            _repo = new RepositoryFactory();
        }

        [HttpGet]
        [Route("GetItems")]
        [ResponseType(typeof(GenericResponse<List<Items>>))]
        public async Task<IHttpActionResult> GetItems()
        {
            var result = await _repo.Item.GetItems();
            return Ok(result);
        }



        [HttpGet]
        [Route("GetVendors")]
        [ResponseType(typeof(GenericResponse<List<AppUsers>>))]
        public async Task<IHttpActionResult> GetVendors()
        {
            var result = await _repo.Item.GetVendors();
            return Ok(result);
        }
        [HttpPost]
        [Route("CreateItem")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> CreateItem(CreateItem item)
        {
            var data = await _repo.Item.CreateItem(item);
            return Ok(data);
        }
        [HttpPost]
        [Route("UpdateItem")]
        [ResponseType(typeof(GenericResponse<Response>))]
        public async Task<IHttpActionResult> UpdateItem(UpdateItem item)
        {
            var result = await _repo.Item.UpdateItem(item);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetItem/{ItemID}")]
        [ResponseType(typeof(GenericResponse<Items>))]
        public async Task<IHttpActionResult> GetItem(long ItemID)
        {
            var result = await _repo.Item.GetItem(ItemID);
            return Ok(result);
        }


        [HttpPost]
        [Route("DeleteItemById/{ItemID}")]
        [ResponseType(typeof(GenericResponse<Items>))]
        public async Task<IHttpActionResult> DeleteItemById(long ItemID)
        {
            var result = await _repo.Item.DeleteItemById(ItemID);
            return Ok(result);
        }

        [HttpPost]
        [Route("PurchaseItem/{ItemID}/{qty}")]
        [ResponseType(typeof(GenericResponse<Items>))]
        public async Task<IHttpActionResult> PurchaseItem(long ItemID, int qty)
        {
            _repo.Item.SessionKey = GetLogedInSessionId();
            var result = await _repo.Item.PurchaseItem(ItemID, qty);
            return Ok(result);
        }


       
    }
}
