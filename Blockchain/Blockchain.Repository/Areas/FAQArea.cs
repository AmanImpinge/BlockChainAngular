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
    public class FAQArea : RepositoryBase
    {
        BlockchainContext _db = null;
        long _loggedInUserId;
        public FAQArea()
        {
            _db = new BlockchainContext();
        }

        public async Task<GenericResponse<Response>> SaveFAQs(CreateFAQModel privacyNotes)
        {
            _loggedInUserId = GetLoginUserId();

            var newFaq = new FAQs
            {
                CreatedBy = _loggedInUserId,
                CreatedOn = DateTime.Now,
                Debug = privacyNotes.Debug,
                Text = privacyNotes.Text,
                WorldId = privacyNotes.WorldId
            };

            _db.FAQs.Add(newFaq);
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = newFaq.Id, Message = Messages.Ok });
        }

        public async Task<GenericResponse<Response>> UpdateFAQs(CreateFAQModel privacyNotes)
        {
            _loggedInUserId = GetLoginUserId();
            var faq = await _db.FAQs.FirstOrDefaultAsync(x => x.Id == privacyNotes.Id);

            if (faq == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            faq.UpdatedBy = _loggedInUserId;
            faq.UpdatedOn = DateTime.Now;
            faq.Debug = privacyNotes.Debug;
            faq.Text = privacyNotes.Text;
            faq.WorldId = privacyNotes.WorldId;

            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = faq.Id, Message = Messages.Ok });
        }

        public async Task<GenericResponse<FAQModel>> GetFAQ(long faqId)
        {
            var faq = await _db.FAQs.FirstOrDefaultAsync(x => x.Id == faqId);

            if (faq == null)
            {
                return CreateErrorResponse<FAQModel>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            FAQModel data = new FAQModel
            {
                UpdatedBy = faq.UpdatedBy,
                UpdatedOn = faq.UpdatedOn,
                Debug = faq.Debug,
                Text = faq.Text,
                CreatedBy = faq.CreatedBy,
                CreatedOn = faq.CreatedOn,
                Id = faq.Id,
                WorldId = faq.WorldId
            };

            return CreateResponse<FAQModel>(Messages.Ok, data);
        }

        public async Task<GenericResponse<FAQModel>> GetWorldFAQ(long worldId)
        {
            var faq = await _db.FAQs.FirstOrDefaultAsync(x => x.WorldId == worldId);

            if (faq == null)
            {
                return CreateErrorResponse<FAQModel>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            FAQModel data = new FAQModel
            {
                UpdatedBy = faq.UpdatedBy,
                UpdatedOn = faq.UpdatedOn,
                Debug = faq.Debug,
                Text = faq.Text,
                CreatedBy = faq.CreatedBy,
                CreatedOn = faq.CreatedOn,
                Id = faq.Id,
                WorldId = faq.WorldId
            };

            return CreateResponse<FAQModel>(Messages.Ok, data);
        }
    }
}
