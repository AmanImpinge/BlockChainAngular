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
    public class PrivacyNotesArea : RepositoryBase
    {
        BlockchainContext _db = null;
        long _loggedInUserId;
        public PrivacyNotesArea()
        {
            _db = new BlockchainContext();
        }

        public async Task<GenericResponse<Response>> SavePrivacyNotes(CreatePrivacyNotes privacyNotes)
        {
            _loggedInUserId = GetLoginUserId();

            var newPrivacyNote = new PrivacyNotes
            {
                CreatedBy = _loggedInUserId,
                CreatedOn = DateTime.Now,
                Debug = privacyNotes.Debug,
                Text = privacyNotes.Text,
                WorldId = privacyNotes.WorldId
            };

            _db.PrivacyNotes.Add(newPrivacyNote);
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = newPrivacyNote.Id, Message = Messages.Ok });
        }

        public async Task<GenericResponse<Response>> UpdatePrivacyNotes(CreatePrivacyNotes privacyNotes)
        {
            _loggedInUserId = GetLoginUserId();
            var privacyNote = await _db.PrivacyNotes.FirstOrDefaultAsync(x => x.Id == privacyNotes.Id);

            if (privacyNote == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            privacyNote.UpdatedBy = _loggedInUserId;
            privacyNote.UpdatedOn = DateTime.Now;
            privacyNote.Debug = privacyNotes.Debug;
            privacyNote.Text = privacyNotes.Text;
            privacyNote.WorldId = privacyNotes.WorldId;

            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = privacyNote.Id, Message = Messages.Ok });
        }

        public async Task<GenericResponse<PrivacyNotesModel>> GetPrivacyNote(long id)
        {
            var privacyNote = await _db.PrivacyNotes.FirstOrDefaultAsync(x => x.Id == id);

            if (privacyNote == null)
            {
                return CreateErrorResponse<PrivacyNotesModel>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            PrivacyNotesModel notes = new PrivacyNotesModel
            {
                UpdatedBy = privacyNote.UpdatedBy,
                UpdatedOn = privacyNote.UpdatedOn,
                Debug = privacyNote.Debug,
                Text = privacyNote.Text,
                CreatedBy = privacyNote.CreatedBy,
                CreatedOn = privacyNote.CreatedOn,
                Id = privacyNote.Id,
                WorldId = privacyNote.WorldId
            };

            return CreateResponse<PrivacyNotesModel>(Messages.Ok, notes);
        }

        public async Task<GenericResponse<PrivacyNotesModel>> GetWorldPrivacyNote(long worldId)
        {
            var privacyNote = await _db.PrivacyNotes.FirstOrDefaultAsync(x => x.WorldId == worldId);

            if (privacyNote == null)
            {
                return CreateErrorResponse<PrivacyNotesModel>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            PrivacyNotesModel notes = new PrivacyNotesModel
            {
                UpdatedBy = privacyNote.UpdatedBy,
                UpdatedOn = privacyNote.UpdatedOn,
                Debug = privacyNote.Debug,
                Text = privacyNote.Text,
                CreatedBy = privacyNote.CreatedBy,
                CreatedOn = privacyNote.CreatedOn,
                Id = privacyNote.Id,
                WorldId = privacyNote.WorldId
            };

            return CreateResponse<PrivacyNotesModel>(Messages.Ok, notes);
        }
    }
}
