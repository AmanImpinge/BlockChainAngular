using Blockchain.Core.Constants;
using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Collections.Generic;
using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using System.Web;

namespace Blockchain.Repository.Areas
{
    public class UserArea : RepositoryBase
    {
        BlockchainContext _db = null;
        long _userId;
        public UserArea()
        {
            _db = new BlockchainContext();
        }

        public async Task<GenericResponse<UserPrefs>> GetUserPrefs()
        {
            _userId = GetLoginUserId();
            var userPrefs = await _db.UserPrefs.FirstOrDefaultAsync(s => s.UPID == _userId);

            //if (userPrefs == null)
            //{
            //    return CreateResponse<UserPrefs>(Messages.Fail, null, new Error
            //    {
            //        ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
            //        Message = Messages.NotFound
            //    });
            //}

            return CreateResponse<UserPrefs>(Messages.Ok, userPrefs);
        }
        public async Task<GenericResponse<InAppPurchases>> GetUserPurchases()
        {
            _userId = GetLoginUserId();
            var data = await _db.InAppPurchases.FirstOrDefaultAsync(s => s.IAUserID == _userId);

            //if (data == null)
            //{
            //    return CreateResponse<InAppPurchases>(Messages.Fail, null, new Error
            //    {
            //        ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
            //        Message = Messages.NotFound
            //    });
            //}

            return CreateResponse<InAppPurchases>(Messages.Ok, data);
        }
        public async Task<GenericResponse<string>> GenerateQRCode(int targetuserID)
        {
            var user = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == targetuserID);

            if (user == null)
            {
                CreateResponse<string>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }

            user.ADQRCodeVal = AppUtils.RandomString(8);
            await _db.SaveChangesAsync();
            var generateQrCode = AppUtils.GenerateQrCode(user.ADQRCodeVal);

            //todo: wire this up to return the image of the QR Code 
            //todo: store QR Code Value wherever its supposed to go and send client side image location? 
            return CreateResponse<string>(Messages.Ok, generateQrCode.ImageBase64String);
        }
        public async Task<GenericResponse<AppUserDetails>> ScanQRCodeForUser(long userId)
        {
            var data = await _db.AppUserDetails.FirstOrDefaultAsync(s => s.ADID == userId);

            if (data == null)
            {
                return CreateResponse<AppUserDetails>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }

            return CreateResponse<AppUserDetails>(Messages.Ok, data);
        }
        public async Task<GenericResponse<List<UserModel>>> GetDirectory()
        {
            var loggedInUser = await (from loginInfo in _db.UserLogins
                                      join user in _db.Appusers on loginInfo.UserId equals user.AUID
                                      where loginInfo.SessionId == SessionKey
                                      select user).FirstOrDefaultAsync();

            var users = await (from user in _db.Appusers
                               join world in _db.Worlds on user.AUWorldID equals world.Id into tempWorld
                               from subWorld in tempWorld.DefaultIfEmpty()
                               where user.AUDeleted == 0 &
                               user.AUAcctStatus == 1 &
                               user.AUWorldID == loggedInUser.AUWorldID
                               select new UserModel
                               {
                                   AUAcctStatusId = user.AUAcctStatus,
                                   AUAcctStatus = ((EnumUtils.AUAcctStatus)user.AUAcctStatus).ToString(),
                                   AUFirstName = user.AUFirstName,
                                   AULastName = user.AULastName,
                                   AUID = user.AUID,
                                   AUUserEmail = user.AUUserEmail,
                                   AUWorldId = user.AUWorldID,
                                   AUWorld = subWorld != null ? subWorld.WorldName : string.Empty,
                                   AUUserClass = ((EnumUtils.AUUserClass)user.AUUserClass).ToString(),
                                   AUPrivLevel = ((EnumUtils.AUPrivLevel)user.AUPrivLevel).ToString(),
                                   AUDebugFlag = user.AUDebugFlag,
                                   AUNickName = user.AUNickName
                               }).ToListAsync();

            return CreateResponse<List<UserModel>>(Messages.Ok, users);
        }
        public async Task<GenericResponse<List<AppUsers>>> GetLeaderBoard()
        {
            var data = await _db.Appusers.Where(s => s.AUUserClass == 1).ToListAsync();

            foreach (var item in data)
            {
                if (item.ProfilePic != null)
                {
                    item.ProfilePicMimeType = item.ProfilePicMimeType + "," + Convert.ToBase64String(item.ProfilePic);
                }
            }

            //todo: wire this up
            //todo: QUERY all the users who are interns order by points desc

            //if (data.Count == 0)
            //{
            //    return CreateResponse<List<AppUsers>>(Messages.Fail, null, new Error
            //    {
            //        ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
            //        Message = Messages.NotFound
            //    });
            //}

            return CreateResponse<List<AppUsers>>(Messages.Ok, data);
        }

        public async Task<GenericResponse<List<ActivitiesCompletedModel>>> GetLeaderBoardByEventId(int eventId)
        {

            var temp = (from actComplte in _db.ActivitiesCompleted
                       join act in _db.ActivityList on actComplte.ACID equals act.ActID
                       join evnt in _db.Events on act.EventId equals evnt.Id 
                        join usr in _db.Appusers on actComplte.ACUserID equals usr.AUID
                        where evnt.Id == eventId
                       select new { Name = usr.AUFirstName + " " + usr.AULastName, Points = actComplte.ACPctComplete,usr.ProfilePic, usr.ProfilePicMimeType } into x
                       group x by new { x.Name, x.Points,x.ProfilePic,x.ProfilePicMimeType } into g
                       select new ActivitiesCompletedModel
                       {
                           UserName = g.Key.Name,
                           TotalPoints = g.Sum(s => s.Points),
                           ProfilePic = g.Key.ProfilePic,
                           ProfilePicMimeType = g.Key.ProfilePicMimeType

                       }).ToList();

         
            foreach (var item in temp)
            {
                if (item.ProfilePic != null)
                {
                    item.ProfilePicMimeType = item.ProfilePicMimeType + "," + Convert.ToBase64String(item.ProfilePic);
                }
            }

            //todo: wire this up
            //todo: QUERY all the users who are interns order by points desc

            //if (data.Count == 0)
            //{
            //    return CreateResponse<List<AppUsers>>(Messages.Fail, null, new Error
            //    {
            //        ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
            //        Message = Messages.NotFound
            //    });
            //}

            return CreateResponse<List<ActivitiesCompletedModel>>(Messages.Ok, temp);
        }

        public async Task<GenericResponse<MarketPlacetResponse>> GetMarketPlaceItems()
        {
            //Get all the items for the marketplace
            var data = await _db.ItemCatalogs.ToListAsync();

            //if (data.Count == 0)
            //{
            //    return CreateResponse<MarketPlacetResponse>(Messages.Fail, null, new Error
            //    {
            //        ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
            //        Message = Messages.NotFound
            //    });
            //}

            return CreateResponse<MarketPlacetResponse>(Messages.Ok, new MarketPlacetResponse { Items = data });
        }
        public async Task<GenericResponse<InAppPurchases>> PurchaseItem(int ItemID, int qty)
        {
            _userId = GetLoginUserId();
            var curUserDetail = await _db.AppUserDetails.FirstOrDefaultAsync(s => s.ADID == _userId);
            var itemToPurchase = await _db.ItemCatalogs.FirstOrDefaultAsync(s => s.ItemID == ItemID);

            if (curUserDetail == null || itemToPurchase == null)
            {
                return CreateResponse<InAppPurchases>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest),
                    Message = Messages.NotFound
                });
            }

            //todoif item is valid to purchase i.e. not out of stock and quantity is < max purchase qty buy it
            if (curUserDetail.ADCurrencyAvail >= itemToPurchase.ItemCost)
            {
                InAppPurchases purchase = new InAppPurchases
                {
                    IAUserID = _userId,
                    IAPurchaseDate = DateTime.Now,
                    IAAppleTransactID = Guid.NewGuid().ToString(),
                    IAAppleStatusCode = 1,
                    IAProductID = string.Empty,
                    IACurrencyValue = itemToPurchase.ItemCost,
                    IAReceiptData = string.Empty
                };
                _db.InAppPurchases.Add(purchase);
                await _db.SaveChangesAsync();
                // On Hold -- todo: wire this up
                return CreateResponse<InAppPurchases>(Messages.Ok, purchase);
            }
            else
            {
                return CreateResponse<InAppPurchases>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest),
                    Message = Messages.NotFound
                });
            }
        }
        public async Task<GenericResponse<List<AppUsers>>> GetUsersByRole(EnumUtils.AUUserClass userClass)
        {
            int auUserClass = Convert.ToInt32(userClass);
            var data = await _db.Appusers.Where(x => x.AUUserClass == auUserClass).ToListAsync();

            return CreateResponse<List<AppUsers>>(Messages.Ok, data);
        }
        public async Task<GenericResponse<Register>> GetUserById(long userId)
        {
            var data = await _db.Appusers.FirstOrDefaultAsync(s => s.AUID == userId);

            if (data == null)
            {
                return CreateResponse<Register>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }
            Register register = new Register();
            register.FirstName = data.AUFirstName;
            register.LastName = data.AULastName;
            register.Email = data.AUUserEmail;
            register.NickName = data.AUNickName;
            register.AUWorldID = data.AUWorldID;
            register.AUUserClass = data.AUUserClass;
            register.Id = data.AUID;

            var appSpecificData = await _db.AppSpecificData.FirstOrDefaultAsync(x => x.ASID == data.AUID);

            if (appSpecificData != null)
            {
                register.BizAreaID = appSpecificData.ASBizAreaID;
                register.ASOfficeID = appSpecificData.ASOfficeID;
            }

            if (data.ProfilePic != null)
            {
                register.ProfilePic = data.ProfilePicMimeType + "," + Convert.ToBase64String(data.ProfilePic);
            }

            return CreateResponse<Register>(Messages.Ok, register);
        }
        public async Task<GenericResponse<Response>> DeleteUserById(long userId)
        {
            var data = await _db.Appusers.FirstOrDefaultAsync(s => s.AUID == userId);

            if (data == null)
            {
                return CreateResponse<Response>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }
            data.AUDeleted = 1;
            await _db.SaveChangesAsync();

            return CreateResponse<Response>(Messages.Ok, new Response
            {
                Id = userId,
                Message = Messages.Success
            });
        }
        public async Task<GenericResponse<UserQRCodeModel>> GetUserQRCode(long userId)
        {
            var userQrCode = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == userId);

            if (userQrCode == null)
            {
                return CreateResponse<UserQRCodeModel>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }

            var userDetails = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == userId);

            UserQRCodeModel code = null;

            if (userDetails != null)
            {
                if (!string.IsNullOrEmpty(userDetails.ADQRCodeVal))
                {
                    var qrCode = AppUtils.GenerateQrCode(userDetails.ADQRCodeVal);
                    code = new UserQRCodeModel
                    {
                        ImageString = qrCode.ImageBase64String,
                        UserId = userQrCode.AUID
                    };
                }
            }

            return CreateResponse<UserQRCodeModel>(Messages.Ok, code);
        }
        public async Task<GenericResponse<BaseResponse>> ChangeUserStatus(long userId, EnumUtils.AUAcctStatus status)
        {
            var user = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == userId);

            if (user == null)
            {
                return CreateResponse<BaseResponse>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound),
                    Message = Messages.NotFound
                });
            }
            user.AUAcctStatus = Convert.ToInt32(status);
            user.AUChangeTime = DateTime.Now;

            await _db.SaveChangesAsync();

            return CreateResponse<BaseResponse>(Messages.Ok, new BaseResponse { Message = Messages.Success });
        }
        public async Task<GenericResponse<Response>> UpdateUserProfile(UpdateProfile appUser)
        {
            var result = new GenericResponse<Response>();
            var curUserDetail = new AppUserDetails();

            AppUsers user = await _db.Appusers.FirstOrDefaultAsync(s => s.AUID == appUser.Id);

            if (user == null)
            {
                result.Status = Messages.Fail;
                result.Error = new Error
                {
                    Message = Messages.NotFound,
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound)
                };

                return result;
            }

            user.AUFirstName = appUser.FirstName;
            user.AULastName = appUser.LastName;
            user.AUUserEmail = appUser.Email;
            user.AUUserName = appUser.Email;
            user.AUChangeTime = DateTime.Now;
            user.AUUserClass = appUser.AUUserClass;
            user.AUWorldID = appUser.AUWorldID;
            if (!string.IsNullOrEmpty(appUser.ProfilePic))
            {
                var profilePic = appUser.ProfilePic.Split(',');
                user.ProfilePicMimeType = profilePic[0];
                user.ProfilePic = Convert.FromBase64String(profilePic[1]);
            }

            await _db.SaveChangesAsync();

            result.Status = Messages.Ok;
            result.Data = new Response
            {
                Id = user.AUID,
                Message = Messages.ProfileUpdated
            };

            await SaveAppSpecificData(new AppSpecificData
            {
                ASID = user.AUID,
                ASOfficeID = appUser.ASOfficeID,
                ASBizAreaID = appUser.BizAreaID,
                ASChangeTime = DateTime.Now
            });

            return result;
        }
        public async Task<GenericResponse<List<UserModel>>> GetUsersList()
        {
            var users = await (from user in _db.Appusers
                               join world in _db.Worlds on user.AUWorldID equals world.Id into tempWorld
                               from subWorld in tempWorld.DefaultIfEmpty()
                               where user.AUDeleted == 0
                               select new UserModel
                               {
                                   AUAcctStatusId = user.AUAcctStatus,
                                   AUFirstName = user.AUFirstName,
                                   AULastName = user.AULastName,
                                   AUID = user.AUID,
                                   AUUserEmail = user.AUUserEmail,
                                   AUWorldId = user.AUWorldID,
                                   AUWorld = subWorld != null ? subWorld.WorldName : string.Empty,
                                   AUUserClass = ((EnumUtils.AUUserClass)user.AUUserClass).ToString(),
                                   AUPrivLevel = user.AUPrivLevel.ToString(),
                                   AUDebugFlag = user.AUDebugFlag,
                                   AUNickName = user.AUNickName,
                                   AUOptionFlags = user.AUOptionFlags
                               }).OrderBy(s => s.AUFirstName).ToListAsync();

            users.ForEach(x =>
            {
                x.AUAcctStatus = ((EnumUtils.AUAcctStatus)x.AUAcctStatusId).ToDisplayName();
                x.AUPrivLevel = ((EnumUtils.AUPrivLevel)Convert.ToInt32(x.AUPrivLevel)).ToDisplayName();
            });

            return CreateResponse<List<UserModel>>(Messages.Ok, users);
        }
        /// <summary>
        /// Get user id by sessionId from database
        /// </summary>
        /// <param name="sessionId">Claim session identifier</param>
        /// <returns></returns>
        /// <exception cref="ArgumentException">Session id not found</exception>
        public async Task<long> GetUserIdBySessionIdAsync(string sessionId)
        {
            var userLogin = await _db.UserLogins.FirstOrDefaultAsync(e => e.SessionId.Equals(sessionId)).ConfigureAwait(false);
            if (userLogin == null)
            {
                throw new ArgumentException("Session id not found", sessionId);
            }
            return userLogin.UserId;
        }

        public async Task<GenericResponse<List<Blockchain.Core.Dal.Entities.Areas>>> GetAreas()
        {
            var areas = await _db.Areas.ToListAsync();

            return CreateResponse<List<Blockchain.Core.Dal.Entities.Areas>>(Messages.Ok, areas);
        }

        public async Task<GenericResponse<List<Offices>>> GetOffices()
        {
            var areas = await _db.Offices.ToListAsync();

            return CreateResponse<List<Offices>>(Messages.Ok, areas);
        }

        private async Task SaveAppSpecificData(AppSpecificData data)
        {
            var appspecificData = await _db.AppSpecificData.FirstOrDefaultAsync(x => x.ASID == data.ASID);

            if (appspecificData == null)
            {
                _db.AppSpecificData.Add(data);
            }
            else
            {
                appspecificData.ASOfficeID = data.ASOfficeID;
                appspecificData.ASBizAreaID = data.ASBizAreaID;
            }

            await _db.SaveChangesAsync().ConfigureAwait(false);
        }
    }
}