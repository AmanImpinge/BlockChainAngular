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
    public class ActivityArea : RepositoryBase
    {
        BlockchainContext Context = null;
        public ActivityArea()
        {
            Context = new BlockchainContext();
        }
        public async Task<GenericResponse<List<ActivityData>>> GetActivities()
        {
            var data = await (from activity in Context.ActivityList
                              join world in Context.Worlds on activity.ActWorldID equals world.Id into tempWorld
                              from subWorld in tempWorld.DefaultIfEmpty()
                              join events in Context.Events on activity.EventId equals events.Id into tempEvent
                              from subEvent in tempEvent.DefaultIfEmpty()
                              where activity.ActDeleted == 0
                              select new ActivityData
                              {
                                  ActCurrencyDelta = activity.ActCurrencyDelta,
                                  ActCurrencyValue = activity.ActCurrencyValue,
                                  ActDebug = activity.ActDebug,
                                  ActDesc = activity.ActDesc,
                                  ActID = activity.ActID,
                                  //ActImageName = activity.ActImageName,
                                  ImageMimetype = activity.ImageMimetype,
                                  Image = activity.Image,
                                  ActMaxCount = activity.ActMaxCount,
                                  ActName = activity.ActName,
                                  ActQRCodeVal = activity.ActQRCodeVal,
                                  ActTriggerFlags = activity.ActTriggerFlags,
                                  ActType = ((Blockchain.Core.Utils.EnumUtils.ActType)activity.ActType).ToString(),
                                  ActWorld = subWorld != null ? subWorld.WorldName : string.Empty,
                                  EventName = subEvent != null ? subEvent.EventName : string.Empty,
                                  ActStartTime = activity.ActStartTime,
                                  ActEndTime = activity.ActEndTime,
                                  Location = activity.Location

                              }).ToListAsync();

            return CreateResponse<List<ActivityData>>(Messages.Ok, data);
        }

        public async Task<GenericResponse<Response>> SaveActivity(Activity activity)
        {
            activity.ActStartTime = DateTime.Parse(activity.FormattedActStartTime);
            activity.ActEndTime = DateTime.Parse(activity.FormattedActEndTime);
            if (activity.ActStartTime > activity.ActEndTime)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.BadRequest, Messages.StartDateTimeShuoldBeLess);
            }

            GenericResponse<Response> response = new GenericResponse<Response>();

            ActivityList newActivity = new ActivityList
            {
                ActName = activity.ActName,
                ActDesc = activity.ActDesc,
                ActType = activity.ActType,
                ActMaxCount = activity.ActMaxCount,
                ActCurrencyValue = activity.ActCurrencyValue,
                ActWorldID = activity.ActWorldID,
                ActCreateTime = DateTime.Now,
                ActQRCodeVal = AppUtils.RandomString(8),
                ActTriggerFlags = 1,
                ActBadgeID = 1,
                ActExperiencePts = 1,
                ActCurrencyDelta = activity.ActCurrencyDelta,
                ActExperienceDelta = activity.ActExperienceDelta,
                ActDeleted = 0,
                ActDebug = activity.ActDebug ? 1 : 0,
                ActStartTime = activity.ActStartTime,
                ActEndTime = activity.ActEndTime,
                EventId = activity.EventId,
                Location = activity.Location
            };
            Context.ActivityList.Add(newActivity);
            await Context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(activity.Image))
            {
                var Pic = activity.Image.Split(',');
                newActivity.ImageMimetype = Pic[0];
                newActivity.Image = Convert.FromBase64String(Pic[1]);
            }
            await Context.SaveChangesAsync();

            string actQRCodeVal = string.Format("{0}_{1}", newActivity.ActID, AppUtils.RandomString(6));
            newActivity.ActQRCodeVal = actQRCodeVal;
            //var qrCode = AppUtils.GenerateQrCode(actQRCodeVal);
            //newActivity.QrCodeData = qrCode.Data;
            //newActivity.QrCodeMimeType = qrCode.MimeType;
            await Context.SaveChangesAsync();

            response.Status = Messages.Ok;
            response.Data = new Response { Message = Messages.Success, Id = newActivity.ActID };

            return response;
        }

        public async Task<GenericResponse<Response>> DeleteActivityById(long ActivityId)
        {
            var data = await Context.ActivityList.FirstOrDefaultAsync(s => s.ActID == ActivityId);

            if (data == null)
            {
                return CreateResponse<Response>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }
            data.ActDeleted = 1;
            await Context.SaveChangesAsync();
            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = ActivityId,
                Message = Messages.Success
            });
        }

        public async Task<GenericResponse<Response>> UpdateActivity(Activity activity)
        {
            activity.ActStartTime = DateTime.Parse(activity.FormattedActStartTime);
            activity.ActEndTime = DateTime.Parse(activity.FormattedActEndTime);

            if (activity.ActStartTime > activity.ActEndTime)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.BadRequest, Messages.StartDateTimeShuoldBeLess);
            }

            var data = await Context.ActivityList.FirstOrDefaultAsync(x => x.ActID == activity.ActID);

            if (data == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            data.ActName = activity.ActName;
            data.ActDesc = activity.ActDesc;
            data.ActCurrencyValue = activity.ActCurrencyValue;
            data.ActType = activity.ActType;
            data.ActMaxCount = activity.ActMaxCount;
            data.ActWorldID = activity.ActWorldID;
            data.ActDebug = activity.ActDebug ? 1 : 0;
            data.ActExperienceDelta = activity.ActExperienceDelta;
            data.ActCurrencyDelta = activity.ActCurrencyDelta;
            data.ActStartTime = activity.ActStartTime;
            data.ActEndTime = activity.ActEndTime;
            data.EventId = activity.EventId;
            data.Location = activity.Location;

            if (!string.IsNullOrEmpty(activity.Image))
            {
                var Pic = activity.Image.Split(',');
                data.ImageMimetype = Pic[0];
                data.Image = Convert.FromBase64String(Pic[1]);
            }

            await Context.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = activity.ActID, Message = Messages.Success });
        }

        public async Task<GenericResponse<Activity>> ActivityDetails(long id)
        {
            var data = await (from activity in Context.ActivityList
                              join world in Context.Worlds on activity.ActWorldID equals world.Id into tempWorld
                              from subWorld in tempWorld.DefaultIfEmpty()
                              join events in Context.Events on activity.EventId equals events.Id into tempEvent
                              from subEvent in tempEvent.DefaultIfEmpty()
                              where activity.ActID == id
                              select new ActivityDetails
                              {
                                  ActCurrencyDelta = activity.ActCurrencyDelta,
                                  ActCurrencyValue = activity.ActCurrencyValue,
                                  ActDebug = activity.ActDebug == 1 ? true : false,
                                  ActDesc = activity.ActDesc,
                                  ActID = activity.ActID,
                                  ActMaxCount = activity.ActMaxCount,
                                  ActName = activity.ActName,
                                  ActQRCodeVal = activity.ActQRCodeVal,
                                  ActTriggerFlags = activity.ActTriggerFlags,
                                  ActType = activity.ActType,
                                  ActWorldID = activity.ActWorldID,
                                  ActExperienceDelta = activity.ActExperienceDelta,
                                  ActStartTime = activity.ActStartTime,
                                  ActEndTime = activity.ActEndTime,
                                  WorldName = subWorld.WorldName,
                                  ImageData = activity.Image,
                                  ImageMimetype = activity.ImageMimetype,
                                  EventId = activity.EventId,
                                  EventName = subEvent != null ? subEvent.EventName : string.Empty,
                                  Location = activity.Location
                              }).FirstOrDefaultAsync();

            if (data.ImageData != null)
            {
                data.Image = data.ImageMimetype + "," + Convert.ToBase64String(data.ImageData);
            }

            data.FormattedActEndTime = data.ActEndTime.ToString("yyyy/MM/dd HH:mm");
            data.FormattedActStartTime = data.ActStartTime.ToString("yyyy/MM/dd HH:mm");
            return CreateResponse<Activity>(Messages.Ok, data);
        }

        public async Task<GenericResponse<Response>> CopyActivity(Activity activity)
        {
            GenericResponse<Response> response = new GenericResponse<Response>();

            ActivityList Saveobj = new ActivityList
            {
                ActName = activity.ActName + "_Copy",
                ActDesc = activity.ActDesc,
                ActType = activity.ActType,
                ActMaxCount = activity.ActMaxCount,
                ActCurrencyValue = activity.ActCurrencyValue,
                ActCreateTime = DateTime.Now,

                // temp values
                //ActImageName = "1",
                ActQRCodeVal = "1",
                //ActType = 1,
                ActTriggerFlags = 1,
                ActBadgeID = 1,
                ActExperiencePts = 1,
                ActCurrencyDelta = 1,
                ActExperienceDelta = 1,
                ActStartTime = DateTime.Now,
                ActEndTime = DateTime.Now,
                ActDeleted = 0,
                ActDebug = 1,
                EventId = activity.EventId,
                Location = activity.Location
            };
            Context.ActivityList.Add(Saveobj);
            await Context.SaveChangesAsync();

            response.Status = Messages.Ok;
            response.Data = new Response { Message = Messages.Success, Id = Saveobj.ActID };

            return response;
        }
    }
}
