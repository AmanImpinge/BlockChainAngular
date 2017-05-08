using Blockchain.Core.Constants;
using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;


namespace Blockchain.Repository.Areas
{
    public class BadgeArea : RepositoryBase
    {
         BlockchainContext _db = null;
        RepositoryFactory _repo;
        long _loggedInUserId;

        public BadgeArea()
        {
            _db = new BlockchainContext();
            _repo = new RepositoryFactory();
        }
        public async Task<GenericResponse<List<BadgeData>>> GetBadges()
        {
            //var data = await _db.BadgeList.ToListAsync();
            var data = await (from badge in _db.BadgeList
                              join world in _db.Worlds on badge.BadgeWorldID equals world.Id into tempWorld
                              from subWorld in tempWorld.DefaultIfEmpty()
                              where badge.BadgeDeleted == 0
                              select new BadgeData
                              {
                                  BadgeID = badge.BadgeID,
                                  BadgeWorldID = subWorld != null ? subWorld.WorldName : string.Empty,
                                  BadgeType = badge.BadgeType,
                                  BadgeModifier = badge.BadgeModifier,
                                  BadgeName = badge.BadgeName,
                                  BadgeDesc = badge.BadgeDesc,
                                  ImageMimetype = badge.ImageMimetype,
                                  Image = badge.Image,
                                  BadgeDeleted = badge.BadgeDeleted,
                                  BadgeDebug = badge.BadgeDebug
                              }).ToListAsync();

            data.ForEach(x =>
            {
                x.BadgeTypeView = ((EnumUtils.BadgeType)x.BadgeType).ToDisplayName();
                x.BadgeModifierView = ((EnumUtils.BadgeModifier)x.BadgeModifier).ToDisplayName();
            });
            //BadgeType = ((EnumUtils.BadgeType)badge.BadgeType).ToDisplayName(),
            //BadgeModifier = ((EnumUtils.BadgeModifier)badge.BadgeModifier).ToDisplayName(),
            return CreateResponse<List<BadgeData>>(Messages.Ok, data);
        }
        public async Task<GenericResponse<Response>> CreateBadge(CreateBadge badge)
        {
            var newBadge = new BadgeList
            {
                BadgeWorldID = badge.BadgeWorldID,
                BadgeType = badge.BadgeType,
                BadgeModifier = badge.BadgeModifier,
                BadgeName = badge.BadgeName,
                BadgeDesc = badge.BadgeDesc,
                //BadgeImageName = badge.Image,
                BadgeDeleted = badge.BadgeDeleted,
                BadgeDebug = badge.BadgeDebug
            };

            _db.BadgeList.Add(newBadge);
            await _db.SaveChangesAsync();

            if (!string.IsNullOrEmpty(badge.Image))
            {
                var Pic = badge.Image.Split(',');
                newBadge.ImageMimetype = Pic[0];
                newBadge.Image = Convert.FromBase64String(Pic[1]);
            }
            await _db.SaveChangesAsync();
            return CreateResponse<Response>(Messages.Ok, new Response { Id = newBadge.BadgeID, Message = Messages.Success });
        }


        public async Task<GenericResponse<Response>> UpdateBadge(UpdateBadge badge)
        {
            var data = await _db.BadgeList.FirstOrDefaultAsync(x => x.BadgeID == badge.BadgeID);

            if (data == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }
            data.BadgeWorldID = badge.BadgeWorldID;
            data.BadgeType = badge.BadgeType;
            data.BadgeModifier = badge.BadgeModifier;
            data.BadgeName = badge.BadgeName;
            data.BadgeDesc = badge.BadgeDesc;
            data.BadgeDeleted = badge.BadgeDeleted;
            data.BadgeDebug = badge.BadgeDebug;

            if (!string.IsNullOrEmpty(badge.Image))
            {
                var Pic = badge.Image.Split(',');
                data.ImageMimetype = Pic[0];
                data.Image = Convert.FromBase64String(Pic[1]);
            }
            await _db.SaveChangesAsync();
            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = badge.BadgeID,
                Message = Messages.Success
            });
        }

        public async Task<GenericResponse<Badge>> GetBadge(long BadgeID)
        {
            var data = await _db.BadgeList.FirstOrDefaultAsync(x => x.BadgeID == BadgeID);
            if (data == null)
            {
                return CreateErrorResponse<Badge>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }
            Badge badge = new Badge
            {
                BadgeID=data.BadgeID,
                BadgeWorldID = data.BadgeWorldID,
                BadgeType = data.BadgeType,
                BadgeModifier = data.BadgeModifier,
                BadgeName = data.BadgeName,
                BadgeDesc = data.BadgeDesc,
                BadgeDeleted = data.BadgeDeleted,
                BadgeDebug = data.BadgeDebug
            };

            if (data.Image != null)
            {
                badge.Image = data.ImageMimetype + "," + Convert.ToBase64String(data.Image);
            }
            return CreateResponse<Badge>(Messages.Ok, badge);
        }
        public async Task<GenericResponse<Response>> DeleteBadgeById(long badgeId)
        {
            var data = await _db.BadgeList.FirstOrDefaultAsync(s => s.BadgeID == badgeId);
            if (data == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }
            //_db.BadgeList.Remove(data);
            data.BadgeDeleted = 1;
            await _db.SaveChangesAsync();
            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = badgeId,
                Message = Messages.Success
            });
        }
    }
}