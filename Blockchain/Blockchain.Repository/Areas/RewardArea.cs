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
    public class RewardArea : RepositoryBase
    {
        BlockchainContext _db = null;
        long _loggedInUserId;
        RepositoryFactory _repo;

        public RewardArea()
        {
            _db = new BlockchainContext();
            _repo = new RepositoryFactory();
        }

        public async Task<GenericResponse<IssueRewardResponse>> IssueReward(IssueRewardRequest issueRewardReq)
        {
            _loggedInUserId = GetLoginUserId();

            var loggedInUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _loggedInUserId);

            if (string.IsNullOrEmpty(loggedInUser.AUDcoinAddress))
            {
                await UpdateAddress(loggedInUser.AUID);
                //return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.FromAddressNotFound);
            }

            var targetUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == issueRewardReq.TargetUserId);

            if (targetUser == null)
            {
                return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.TargetUserNotFound);
            }

            if (string.IsNullOrEmpty(targetUser.AUDcoinAddress))
            {
                await UpdateAddress(targetUser.AUID);
                //return CreateErrorResponse<IssueRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.TargetAddressNotFound);
            }

            Dictionary<string, object> dictionaryParams = new Dictionary<string, object>();
            dictionaryParams["contractHash"] = loggedInUser.AUDcoinAddress;
            dictionaryParams["amount"] = issueRewardReq.Amount;
            dictionaryParams["agentAddress"] = targetUser.AUDcoinAddress;

            var issueReward = await AppUtils.MakeGetRequestAsync<IssueRewardResponse>("/issue", dictionaryParams);
            await SaveIssuedReward(issueRewardReq.TargetUserId, issueRewardReq.Amount);

            //save transaction
            var newTransaction = new CreateTransaction
            {
                Trans_BCaddress = targetUser.AUDcoinAddress,
                Trans_BCtransactionHash = issueReward.Data.TxHash,
                TransAmount = issueRewardReq.Amount,
                TransDate = DateTime.Now,
                TransItemID = -1,
                TransRecipientID = targetUser.AUID,
                TransStatusCode = issueReward.Status == Messages.Ok ? Convert.ToInt32(EnumUtils.TransStatusCode.Successful) : Convert.ToInt32(EnumUtils.TransStatusCode.Undefined),
                TransUserID = loggedInUser.AUID,
                TransWorldID = loggedInUser.AUWorldID
            };

            await _repo.Transaction.SaveTransaction(newTransaction);

            return issueReward;
        }

        public async Task<GenericResponse<CreateRewardResponse>> CreateReward(long targetUserId)
        {
            var targetUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == targetUserId);

            if (targetUser == null)
            {
                return CreateErrorResponse<CreateRewardResponse>(EnumUtils.StatusCode.NotFound, Messages.TargetUserNotFound);
            }

            if (!string.IsNullOrEmpty(targetUser.AUDcoinAddress))
            {
                return CreateErrorResponse<CreateRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.RewardAlreadyCreated);
            }

            Dictionary<string, object> dictionaryParams = new Dictionary<string, object>();
            dictionaryParams["id"] = targetUserId.ToString();
            var createReward = await AppUtils.MakeGetRequestAsync<CreateRewardResponse>("/createReward", dictionaryParams);

            if (createReward.Status != Messages.Ok)
            {
                return CreateResponse<CreateRewardResponse>(Messages.Fail, null, new Error
                {
                    ErrorCode = createReward.Error.ErrorCode,
                    Message = createReward.Error.Message
                });
            }

            targetUser.AUDcoinAddress = createReward.Data.Address;
            await _db.SaveChangesAsync();

            return createReward;
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

        //Pending
        //public async Task<GenericResponse<TransferPointsResponse>> TransferPoints(int targetUserID, int numPointsToTransfer)
        //{
        //    int userId = 0;
        //    var result = new GenericResponse<TransferPointsResponse>();
        //    //todo: wire this up to datapulls
        //    var curUserDetail = new AppUserDetails();
        //    var targetUserDetail = new AppUserDetails();
        //    if (curUserDetail.ADCurrencyAvail >= numPointsToTransfer)
        //    {   //lets transfer the points
        //        curUserDetail.ADCurrencyAvail -= numPointsToTransfer;
        //        targetUserDetail.ADCurrencyAvail += numPointsToTransfer;
        //        targetUserDetail.ADCurrencyTotal += numPointsToTransfer;
        //        //context.save
        //        //todo:// do we need to log anything here?
        //    }
        //    else
        //    {
        //        //todo return a error that says insufficient funds?
        //        result.Status = Messages.Fail;
        //        result.Error = new Error { ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest), Message = Messages.Fail };
        //    }
        //    //result.Data = responseObject;
        //    result.Status = Messages.Ok;

        //    return result;
        //}

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

                // removed by rico
               // fromUserDetail.ADCurrencyTotal -= request.Amount; 


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

        private async Task SaveIssuedReward(long userId, int amount)
        {
            var userDetails = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == userId);

            if (userDetails == null)
            {
                userDetails = new AppUserDetails
                {
                    ADChangeTime = DateTime.Now,
                    ADLastPlayTime = DateTime.Now,
                    ADID = userId,
                    ADQRCodeVal = AppUtils.RandomString(8)
                };
                _db.AppUserDetails.Add(userDetails);
            }

            else
            {
                userDetails.ADCurrencyAvail = userDetails.ADCurrencyAvail + amount;
                userDetails.ADCurrencyTotal = userDetails.ADCurrencyTotal + amount;
                userDetails.ADChangeTime = DateTime.Now;
            }

            await _db.SaveChangesAsync();
        }

        public async Task<GenericResponse<BalanceRewardResponse>> GetBalanceDB(long targetUserId)
        {
            var appUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == targetUserId);

            if (appUser == null)
            {
                return CreateErrorResponse<BalanceRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.NotFound);
            }

            var userDetails = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == targetUserId);

            if (userDetails == null)
            {
                return CreateErrorResponse<BalanceRewardResponse>(EnumUtils.StatusCode.BadRequest, Messages.TargetUserDetailsNotFound);
            }

            return CreateResponse<BalanceRewardResponse>(Messages.Ok, new BalanceRewardResponse { Balance = userDetails.ADCurrencyTotal });
        }

        private async Task UpdateAddress(long userId)
        {
            var createRewardReq = await CreateReward(userId);

            if (createRewardReq.Status == Messages.Ok)
            {
                var appuser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == userId);
                if (appuser != null)
                {
                    appuser.AUDcoinAddress = createRewardReq.Data.Address;
                    await _db.SaveChangesAsync();
                }
            }
        }
    }
}
