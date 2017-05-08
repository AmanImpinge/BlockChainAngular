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
    public class TransactionsArea : RepositoryBase
    {
        BlockchainContext _db = null;
        long _loggedInUserId;

        public TransactionsArea()
        {
            _db = new BlockchainContext();
        }

        public async Task<GenericResponse<List<TransactionsModel>>> GetAllTransactions()
        {
            var transactions = await (from transaction in _db.Transactions
                                      join fromUser in _db.Appusers on transaction.TransUserID equals fromUser.AUID
                                      join recipient in _db.Appusers on transaction.TransRecipientID equals recipient.AUID
                                      join world in _db.Worlds on transaction.TransWorldID equals world.Id
                                      select new TransactionsModel
                                      {
                                          Trans_BCaddress = transaction.Trans_BCaddress,
                                          Trans_BCtransactionHash = transaction.Trans_BCtransactionHash,
                                          TransAmount = transaction.TransAmount,
                                          TransDate = transaction.TransDate,
                                          TransDebug = transaction.TransDebug,
                                          TransID = transaction.TransID,
                                          TransItemID = transaction.TransItemID,
                                          TransRecipientID = transaction.TransRecipientID,
                                          RecipientName = recipient.AUFirstName + " " + recipient.AULastName,
                                          TransStatusCode = transaction.TransStatusCode,
                                          TransUserID = transaction.TransUserID,
                                          TransUserName = recipient.AUFirstName + " " + recipient.AULastName,
                                          TransWorldID = transaction.TransWorldID,
                                          WorldName = world.WorldName,
                                          TransStatus = ((EnumUtils.TransStatusCode)transaction.TransStatusCode).ToString(),
                                          Type = transaction.TransItemID == -1 ? "Transfer" : "Purchase"
                                      }).ToListAsync();

            transactions.ForEach(x =>
            {
                x.TransFormattedDate = x.TransDate.ToString("dd-MMM-yyyy");
            });


            var badgesData = await (from badges in _db.BadgesEarned
                                join fromUser in _db.Appusers on badges.BESendingUserID equals fromUser.AUID
                                join recipient in _db.Appusers on badges.BEOtherUserID equals recipient.AUID
                                    join world in _db.Worlds on badges.BEWorldID equals world.Id
                                      select new TransactionsModel
                                      {
                                          TransAmount = badges.BEValue,
                                          TransDate = badges.BEDate,
                                          //TransDebug = badges.DebugFlag,
                                          TransID = badges.BEBadgeID,
                                          //TransRecipientID = badges.TransRecipientID,
                                          RecipientName = recipient.AUFirstName + " " + recipient.AULastName,
                                          //TransStatusCode = badges.TransStatusCode,
                                          //TransUserID = badges.TransUserID,
                                          TransUserName = recipient.AUFirstName + " " + recipient.AULastName,
                                          //TransWorldID = badges.BEWorldID,
                                          WorldName = world.WorldName,
                                          //TransStatus = ((EnumUtils.TransStatusCode)transaction.TransStatusCode).ToString()
                                          TransStatus = "TBD",
                                           Type="Badge"
                                      }).ToListAsync();

            badgesData.ForEach(x =>
            {
                x.TransFormattedDate = x.TransDate.ToString("dd-MMM-yyyy");
            });
            transactions.Concat(badgesData);
            return CreateResponse<List<TransactionsModel>>(Messages.Ok, transactions);
        }

        public async Task<GenericResponse<List<TransactionsModel>>> GetUserTransactions(long userId)
        {
            var transactions = await (from transaction in _db.Transactions
                                      join fromUser in _db.Appusers on transaction.TransUserID equals fromUser.AUID
                                      join recipient in _db.Appusers on transaction.TransRecipientID equals recipient.AUID
                                      join world in _db.Worlds on transaction.TransWorldID equals world.Id
                                      where transaction.TransRecipientID == userId || transaction.TransUserID==userId 
                                      select new TransactionsModel
                                      {
                                          Trans_BCaddress = transaction.Trans_BCaddress,
                                          Trans_BCtransactionHash = transaction.Trans_BCtransactionHash,
                                          TransAmount = transaction.TransAmount,
                                          TransDate = transaction.TransDate,
                                          TransDebug = transaction.TransDebug,
                                          TransID = transaction.TransID,
                                          TransItemID = transaction.TransItemID,
                                          TransRecipientID = transaction.TransRecipientID,
                                          RecipientName = recipient.AUFirstName + " " + recipient.AULastName,
                                          TransStatusCode = transaction.TransStatusCode,
                                          TransUserID = transaction.TransUserID,
                                          TransUserName = recipient.AUFirstName + " " + recipient.AULastName,
                                          TransWorldID = transaction.TransWorldID,
                                          WorldName = world.WorldName,
                                          TransStatus = ((EnumUtils.TransStatusCode)transaction.TransStatusCode).ToString()
                                      }).ToListAsync();

            transactions.ForEach(x =>
            {
                x.TransFormattedDate = x.TransDate.ToString("dd-MMM-yyyy");
            });

            return CreateResponse<List<TransactionsModel>>(Messages.Ok, transactions);
        }

        public async Task<GenericResponse<Response>> SaveTransaction(CreateTransaction transaction)
        {
            Transactions newTransaction = new Transactions
            {
                Trans_BCaddress = transaction.Trans_BCaddress,
                Trans_BCtransactionHash = transaction.Trans_BCtransactionHash,
                TransAmount = transaction.TransAmount,
                TransDate = transaction.TransDate,
                TransDebug = transaction.TransDebug,
                TransID = transaction.TransID,
                TransItemID = transaction.TransItemID,
                TransRecipientID = transaction.TransRecipientID,
                TransStatusCode = transaction.TransStatusCode,
                TransUserID = transaction.TransUserID,
                TransWorldID = transaction.TransWorldID
            };

            _db.Transactions.Add(newTransaction);
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response { Id = newTransaction.TransID, Message = Messages.Ok });
        }
    }
}
