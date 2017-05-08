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
    public class EventArea : RepositoryBase
    {
        BlockchainContext _db = null;
        long _loggedInUserId;
        public EventArea()
        {
            _db = new BlockchainContext();
        }

        public async Task<GenericResponse<Response>> SaveEvent(CreateEvent eventData)
        {
            _loggedInUserId = GetLoginUserId();

            var newEvent = new Events
            {
                CreatedBy = _loggedInUserId,
                CreateOn = DateTime.Now,
                DebugFlag = eventData.DebugFlag,
                Description = eventData.Description,
                EventName = eventData.EventName,
                WorldId = eventData.WorldId
            };

            _db.Events.Add(newEvent);
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = newEvent.Id, Message = Messages.Ok });
        }

        public async Task<GenericResponse<Response>> UpdateEvent(UpdateEvent eventData)
        {
            var eventInfo = await _db.Events.FirstOrDefaultAsync(x => x.Id == eventData.Id);

            if (eventInfo == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            _loggedInUserId = GetLoginUserId();

            eventInfo.EventName = eventData.EventName;
            eventInfo.Description = eventData.Description;
            eventInfo.UpdatedBy = _loggedInUserId;
            eventInfo.UpdatedOn = DateTime.Now;
            eventInfo.DebugFlag = eventData.DebugFlag;
            eventInfo.WorldId = eventData.WorldId;

            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = eventData.Id, Message = Messages.Ok });
        }

        public async Task<GenericResponse<EventModel>> GetEvent(long eventId)
        {
            var eventData = await _db.Events.FirstOrDefaultAsync(x => x.Id == eventId);

            if (eventData == null)
            {
                return CreateErrorResponse<EventModel>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            var newEvent = new EventModel
            {
                EventName = eventData.EventName,
                Description = eventData.Description,
                UpdatedBy = eventData.UpdatedBy,
                UpdatedOn = eventData.UpdatedOn,
                DebugFlag = eventData.DebugFlag,
                CreatedBy = eventData.CreatedBy,
                CreateOn = eventData.CreateOn,
                Deleted = eventData.Deleted,
                Id = eventData.Id,
                WorldId=eventData.WorldId
            };

            await _db.SaveChangesAsync();

            return CreateResponse<EventModel>(Messages.Ok, newEvent);
        }

        public async Task<GenericResponse<List<EventModel>>> GetEvents()
        {
            var eventList = await _db.Events.Where(x => x.Deleted == 0).ToListAsync();

            List<EventModel> events = new List<EventModel>();
            eventList.ForEach(eventData =>
            {
                events.Add(new EventModel
                {
                    EventName = eventData.EventName,
                    Description = eventData.Description,
                    UpdatedBy = eventData.UpdatedBy,
                    UpdatedOn = eventData.UpdatedOn,
                    DebugFlag = eventData.DebugFlag,
                    CreatedBy = eventData.CreatedBy,
                    CreateOn = eventData.CreateOn,
                    Deleted = eventData.Deleted,
                    Id = eventData.Id,
                    FormattedCreateOn=eventData.CreateOn.ToString("dd-MMM-yyyy hh:MM:tt")
                });
            });

            return CreateResponse<List<EventModel>>(Messages.Ok, events);
        }

        public async Task<GenericResponse<Response>> DeleteEvent(long eventId)
        {
            var eventInfo = await _db.Events.FirstOrDefaultAsync(x => x.Id == eventId);

            if (eventInfo == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            eventInfo.Deleted = 1;
            eventInfo.UpdatedBy = _loggedInUserId;
            eventInfo.UpdatedOn = DateTime.Now;

            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = eventId, Message = Messages.Ok });
        }
    }
}
