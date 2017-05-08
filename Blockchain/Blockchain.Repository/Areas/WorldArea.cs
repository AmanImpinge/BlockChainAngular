using Blockchain.Core.Constants;
using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Blockchain.Core.Utils;

namespace Blockchain.Repository.Areas
{
    public class WorldArea : RepositoryBase
    {
        BlockchainContext _db = null;

        public WorldArea()
        {
            _db = new BlockchainContext();
        }

        public async Task<GenericResponse<List<WorldModel>>> GetWorlds()
        {
            var data = await (from world in _db.Worlds
                              join appUser in _db.Appusers on world.CreatedBy equals appUser.AUID into tempAppUser
                              from subUser in tempAppUser.DefaultIfEmpty()
                              join updatedByUser in _db.Appusers on world.UpdatedBy equals updatedByUser.AUID into tempUpdateAppUser
                              from subUpdateUser in tempUpdateAppUser.DefaultIfEmpty()
                              select new WorldModel
                              {
                                  Description = world.Description,
                                  Id = world.Id,
                                  WorldChangeTime = world.WorldChangeTime,
                                  WorldCreateTime = world.WorldCreateTime,
                                  WorldDebugFlag = world.WorldDebugFlag == 1 ? true : false,
                                  WorldDeleted = world.WorldDeleted,
                                  WorldName = world.WorldName,
                                  CreatedBy = subUser != null ? subUser.AUFirstName + " " + subUser.AULastName : string.Empty,
                                  UpdatedBy = subUpdateUser != null ? subUpdateUser.AUFirstName + " " + subUpdateUser.AULastName : string.Empty,
                              }).ToListAsync();

            return CreateResponse<List<WorldModel>>(Messages.Ok, data);
        }

        public async Task<GenericResponse<Response>> CreateWorld(WorldModel world)
        {
            world.WorldCreateTime = DateTime.Now;
            World newWorld = new World
            {
                WorldName = world.WorldName,
                Description = world.Description,
                WorldCreateTime = DateTime.Now,
                WorldDebugFlag = world.WorldDebugFlag ? 1 : 0,
                CreatedBy = GetLoginUserId()
            };

            _db.Worlds.Add(newWorld);
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = world.Id,
                Message = Messages.Success
            });
        }

        public async Task<GenericResponse<Response>> UpdateWorld(WorldModel world)
        {
            var data = await _db.Worlds.FirstOrDefaultAsync(x => x.Id == world.Id);

            if (data == null)
            {
                return CreateResponse<Response>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }

            data.WorldName = world.WorldName;
            data.Description = world.Description;
            data.WorldDebugFlag = world.WorldDebugFlag ? 1 : 0;
            data.WorldChangeTime = DateTime.Now;
            data.UpdatedBy = GetLoginUserId();
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = world.Id,
                Message = Messages.Success
            });
        }

        public async Task<GenericResponse<WorldModel>> GetWorld(long id)
        {
            var data = await _db.Worlds.FirstOrDefaultAsync(x => x.Id == id);

            if (data == null)
            {
                return CreateResponse<WorldModel>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }

            WorldModel world = new WorldModel
            {
                Description = data.Description,
                Id = data.Id,
                WorldChangeTime = data.WorldChangeTime,
                WorldCreateTime = data.WorldCreateTime,
                WorldDebugFlag = data.WorldDebugFlag == 1 ? true : false,
                WorldDeleted = data.WorldDeleted,
                WorldName = data.WorldName
            };

            return CreateResponse<WorldModel>(Messages.Ok, world);
        }
    }
}
