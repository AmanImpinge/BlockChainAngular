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
    public class ItemArea : RepositoryBase
    {
        BlockchainContext _db = null;
        RepositoryFactory _repo;
        long _loggedInUserId;

        public ItemArea()
        {
            _db = new BlockchainContext();
            _repo = new RepositoryFactory();
        }
        public async Task<GenericResponse<List<Items>>> GetItems()
        {
            //var data = await _db.ItemCatalogs.ToListAsync();
            var data = await (from item in _db.ItemCatalogs
                              join world in _db.Worlds on item.ItemWorldID equals world.Id into tempWorld
                              from subWorld in tempWorld.DefaultIfEmpty()

                              join user in _db.Appusers on item.UserId equals user.AUID into tempUser
                              from subUser in tempUser.DefaultIfEmpty()

                              select new Items { DebugFlag = item.DebugFlag, ImageName = item.Image, ItemCategory = item.ItemCategory, ItemCost = item.ItemCost, ItemDeliveryMode = item.ItemDeliveryMode, ItemDesc = item.ItemDesc, ItemID = item.ItemID, ItemName = item.ItemName, ItemQtyLimit = item.ItemQtyLimit, ItemStatus = item.ItemStatus, ItemWorldID = item.ItemWorldID, UserId = item.UserId, UserName = subUser != null ? subUser.AUFirstName + " " + subUser.AULastName : string.Empty, WorldName = subWorld != null ? subWorld.WorldName : string.Empty, Status = ((EnumUtils.ItemStatus)item.ItemStatus).ToString() }

                                 ).ToListAsync();

            return CreateResponse<List<Items>>(Messages.Ok, data);
        }


        public async Task<GenericResponse<List<AppUsers>>> GetVendors()
        {
            var data = await _db.Appusers.Where(s => s.AUUserClass == 3).ToListAsync();
            return CreateResponse<List<AppUsers>>(Messages.Ok, data);
        }

        public async Task<GenericResponse<Response>> CreateItem(CreateItem item)
        {
            var vendorDetails = await _repo.User.GetUserById(item.UserId);
            if (vendorDetails.Status != Messages.Ok)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.BadRequest, vendorDetails.Error.Message);
            }

            var newItem = new ItemCatalog
            {
                DebugFlag = item.DebugFlag,
                ItemCategory = item.ItemCategory,
                ItemCost = item.ItemCost,
                ItemDeliveryMode = item.ItemDeliveryMode,
                ItemDesc = item.ItemDesc,
                ItemName = item.ItemName,
                ItemQtyLimit = item.ItemQtyLimit,
                ItemStatus = item.ItemStatus,
                ItemWorldID = vendorDetails.Data.AUWorldID,
                UserId = item.UserId
            };

            _db.ItemCatalogs.Add(newItem);
            await _db.SaveChangesAsync();

            if (!string.IsNullOrEmpty(item.Image))
            {
                var Pic = item.Image.Split(',');
                newItem.ImageMimetype = Pic[0];
                newItem.Image = Convert.FromBase64String(Pic[1]);
            }
            await _db.SaveChangesAsync();



            return CreateResponse<Response>(Messages.Ok, new Response { Id = newItem.ItemID, Message = Messages.Success });
        }


        public async Task<GenericResponse<Response>> UpdateItem(UpdateItem item)
        {
            var vendorDetails = await _repo.User.GetUserById(item.UserId);
            if (vendorDetails.Status != Messages.Ok)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.BadRequest, vendorDetails.Error.Message);
            }

            var data = await _db.ItemCatalogs.FirstOrDefaultAsync(x => x.ItemID == item.ItemID);

            if (data == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }

            data.DebugFlag = item.DebugFlag;
            data.ItemCategory = item.ItemCategory;
            data.ItemCost = item.ItemCost;
            data.ItemDeliveryMode = item.ItemDeliveryMode;
            data.ItemDesc = item.ItemDesc;
            data.ItemName = item.ItemName;
            data.ItemQtyLimit = item.ItemQtyLimit;
            data.ItemStatus = item.ItemStatus;
            data.ItemWorldID = vendorDetails.Data.AUWorldID;
            data.UserId = item.UserId;

            if (!string.IsNullOrEmpty(item.Image))
            {
                var Pic = item.Image.Split(',');
                data.ImageMimetype = Pic[0];
                data.Image = Convert.FromBase64String(Pic[1]);
            }

            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = item.ItemID,
                Message = Messages.Success
            });
        }

        public async Task<GenericResponse<Items>> GetItem(long ItemID)
        {
            var data = await _db.ItemCatalogs.FirstOrDefaultAsync(x => x.ItemID == ItemID);
            if (data == null)
            {
                return CreateErrorResponse<Items>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }
            Items item = new Items
            {
                ItemDesc = data.ItemDesc,
                ItemName = data.ItemName,
                UserId = data.UserId,
                ItemCategory = data.ItemCategory,
                ItemDeliveryMode = data.ItemDeliveryMode,
                ItemQtyLimit = data.ItemQtyLimit,
                ItemCost = data.ItemCost,
                ItemWorldID = data.ItemWorldID,
                ItemID = data.ItemID,
                DebugFlag = data.DebugFlag
            };

            if (data.Image != null)
            {
                item.Image = data.ImageMimetype + "," + Convert.ToBase64String(data.Image);
            }


            return CreateResponse<Items>(Messages.Ok, item);
        }


        public async Task<GenericResponse<Response>> DeleteItemById(long itemId)
        {
            var data = await _db.ItemCatalogs.FirstOrDefaultAsync(s => s.ItemID == itemId);

            if (data == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
            }
            _db.ItemCatalogs.Remove(data);
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = itemId,
                Message = Messages.Success
            });
        }



        public async Task<GenericResponse<BalanceRewardResponse>> GetBalance(long targetUserId)
        {
            _loggedInUserId = GetLoginUserId();
            var loggedInUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _loggedInUserId);

            if (string.IsNullOrEmpty(loggedInUser.AUDcoinAddress))
            {
                return CreateErrorResponse<BalanceRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.FromAddressNotFound);
            }
            var targetUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == targetUserId);
            if (targetUser == null)
            {
                return CreateErrorResponse<BalanceRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.TargetUserNotFound);
            }
            if (string.IsNullOrEmpty(targetUser.AUDcoinAddress))
            {
                return CreateErrorResponse<BalanceRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.TargetAddressNotFound);
            }
            Dictionary<string, object> dictionaryParams = new Dictionary<string, object>();
            dictionaryParams["contractHash"] = loggedInUser.AUDcoinAddress;
            dictionaryParams["agentAddress"] = targetUser.AUDcoinAddress;
            var response = await AppUtils.MakeGetRequestAsync<BalanceRewardResponse>("/balance", dictionaryParams);
            return response;
        }
        public async Task<GenericResponse<IssueRewardResponse>> TransferBalance(TransferMoney request)
        {
            _loggedInUserId = GetLoginUserId();
            var userInfo = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == request.UserId);
            if (userInfo == null)
            {
                return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.InvalidFromUserId);
            }
            if (string.IsNullOrEmpty(userInfo.AUDcoinAddress))
            {
                return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.FromAddressNotFound);
            }

            var targetUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == request.TargetUserId);
            if (targetUser == null)
            {
                return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.InvalidTargetUserId);
            }
            if (string.IsNullOrEmpty(targetUser.AUDcoinAddress))
            {
                return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.TargetAddressNotFound);
            }

            var fromUserDetail = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == request.UserId);
            if (fromUserDetail == null)
            {
                return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.FromUserHasNotEnoughMoney);
            }

            if (fromUserDetail.ADCurrencyAvail >= request.Amount)
            {
                var loggedInInfo = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _loggedInUserId);
                Dictionary<string, object> dictionaryParams = new Dictionary<string, object>();
                dictionaryParams["agentAddress"] = userInfo.AUDcoinAddress; // from address
                dictionaryParams["contractHash"] = loggedInInfo.AUDcoinAddress;//logged in user's address
                dictionaryParams["destinationAddress"] = targetUser.AUDcoinAddress; // to address
                dictionaryParams["amount"] = request.Amount;

                var issueReward = await AppUtils.MakeGetRequestAsync<IssueRewardResponse>("/transfer", dictionaryParams);

                fromUserDetail.ADCurrencyAvail -= request.Amount;
                fromUserDetail.ADCurrencyTotal -= request.Amount;
                var targetUserDetails = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == request.TargetUserId);

                if (targetUserDetails != null)
                {
                    targetUserDetails.ADCurrencyAvail += request.Amount;
                    targetUserDetails.ADCurrencyTotal += request.Amount;
                }
                await _db.SaveChangesAsync();

                return issueReward;
            }

            return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.FromUserHasNotEnoughMoney);
        }

        public async Task<GenericResponse<Response>> PurchaseItem(long ItemID, int qty)
        {
            _loggedInUserId = GetLoginUserId();
            var loggedInUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _loggedInUserId);
            //long TargetUserId = 2;// need to change
            var data = await _db.ItemCatalogs.FirstOrDefaultAsync(s => s.ItemID == ItemID);
            if (data == null)
            {
                // return CreateErrorResponse<Response>(EnumUtils.StatusCode.NotFound, Messages.NotFound);
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.InvalidItemId, Messages.InvalidItemId);
            }
            // if quantity is less available
            if (data.ItemQtyLimit < qty)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.LessQuantity, Messages.LessQuantity);
            }
            // Calculate total amount to be deduct
            int DeductionAmount = data.ItemCost * qty;
            // fetch intern balance
            RewardArea obj = new RewardArea();
            var InternData = await GetBalance(_loggedInUserId);
            // if intern balance is less than amount to be deduct
            if (InternData.Data.Balance < DeductionAmount)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.InsufficientBalance, Messages.InsufficientBalance);
            }
            // deduct amount from intern
            AppUserDetails Intern = _db.AppUserDetails.Where(s => s.ADID == _loggedInUserId).SingleOrDefault();
            Intern.ADCurrencyAvail = (Intern.ADCurrencyAvail - DeductionAmount);
            //await _db.SaveChangesAsync();
            // add amount to vendor (based on item catalog userId)
            AppUserDetails Vendor = _db.AppUserDetails.Where(s => s.ADID == data.UserId).SingleOrDefault();
            Intern.ADCurrencyAvail = (Intern.ADCurrencyAvail + DeductionAmount);
            //await _db.SaveChangesAsync();
            // get target user data
            //  var targetUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == TargetUserId);
            // create transfer money object and call transfer balance api
            TransferMoney transferMoney = new TransferMoney() { Amount = DeductionAmount, TargetUserId = _loggedInUserId, UserId = data.UserId };
            var transferApiResponse = await TransferBalance(transferMoney);

            if (transferApiResponse.Data == null)
            {
                return CreateErrorResponse<Response>(EnumUtils.StatusCode.InsufficientBalance, transferApiResponse.Error.Message);
            }
            //save transaction
            Transactions newTransaction = new Transactions
            {
                Trans_BCaddress = loggedInUser.AUDcoinAddress,
                Trans_BCtransactionHash = transferApiResponse.Data.TxHash,
                TransAmount = DeductionAmount,
                TransDate = DateTime.Now,
                TransItemID = Convert.ToInt32(ItemID),
                TransRecipientID = loggedInUser.AUID,
                TransStatusCode = transferApiResponse.Status == Messages.Ok ? Convert.ToInt32(EnumUtils.TransStatusCode.Successful) : Convert.ToInt32(EnumUtils.TransStatusCode.Undefined),
                TransUserID = loggedInUser.AUID,
                TransWorldID = loggedInUser.AUWorldID
            };
            _db.Transactions.Add(newTransaction);
            await _db.SaveChangesAsync();
            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = newTransaction.TransID,
                Message = Messages.Success
            });

        }
    }
}
