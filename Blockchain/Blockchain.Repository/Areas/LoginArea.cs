using Blockchain.Core.Constants;
using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Dal.EntityContext;
using Blockchain.Core.Models;
using Blockchain.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace Blockchain.Repository.Areas
{
    public class LoginArea : RepositoryBase
    {
        BlockchainContext _db = null;
        string email;
        string password;
        string saltKey;
        long _userId;

        public LoginArea()
        {
            _db = new BlockchainContext();
            email = "rico@gmail.com";
            password = "Rico@001";
            saltKey = "delloitteBlah";
        }

        //wired up
        public async Task<GenericResponse<LoginResponse>> LoginUser(Login login)
        {
            var userDetails = await _db.Appusers.FirstOrDefaultAsync(x => x.AUUserEmail == login.Email);
            var result = new GenericResponse<LoginResponse>();

            if (userDetails == null)
            {
                return CreateResponse<LoginResponse>(Messages.Fail, null, new Error { ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest), Message = Messages.InvalidEmail });
            }


            string computedHash = EncryptionUtility.ComputeHash(login.Password, saltKey);

            //if (computedHash == userDetails.AUPWHash)
            if (1 == 1)
            {
                result = CreateResponse<LoginResponse>(Messages.Ok, new LoginResponse
                {
                    SessionId = Guid.NewGuid().ToString(),
                    ExpiryTime = DateTime.Now.AddDays(1)
                });

                UserLogins userLogin = new UserLogins
                {
                    SessionId = result.Data.SessionId,
                    UserId = userDetails.AUID,
                    ExpiryTime = result.Data.ExpiryTime
                };

                _db.UserLogins.Add(userLogin);
                await _db.SaveChangesAsync();
            }
            else
            {
                result = CreateResponse<LoginResponse>(Messages.Fail, null, new Error { ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest), Message = Messages.InvalidPassword });
            }

            return result;
        }

        //wired up
        public async Task<GenericResponse<BaseResponse>> ForgotPassword(ForgotPassword forgotPassword)
        {
            var user = await _db.Appusers.FirstOrDefaultAsync(x => x.AUUserEmail == forgotPassword.Email);
            var result = new GenericResponse<BaseResponse>();

            if (user == null)
            {
                result.Status = Messages.Fail;
                result.Error = new Error
                {

                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest),
                    Message = Messages.UserEmailNotExists
                };

                return result;
            }

            string newPwd = AppUtils.RandomString(6);

            await AppUtils.SendEmail(new MailInfo
            {
                Body = string.Format("Here is your new password: {0}", newPwd),
                IsBodyHtml = false,
                Subject = "Forgot Password email",
                ToAddress = forgotPassword.Email
            });

            user.AUPWHash = EncryptionUtility.ComputeHash(newPwd, saltKey);
            user.AUPWSalt = saltKey;
            await _db.SaveChangesAsync();

            result.Status = Messages.Ok;
            result.Data = new BaseResponse { Message = Messages.Success };
            return result;
        }

        //wired up
        public async Task<GenericResponse<Response>> RegisterUser(Register register)
        {
            GenericResponse<Response> response = new GenericResponse<Response>();
            var userInfo = await _db.Appusers.FirstOrDefaultAsync(x => x.AUUserEmail == register.Email);

            if (userInfo != null)
            {
                response.Status = Messages.Fail;
                response.Error = new Error { Message = Messages.EmailAlreadyExists, ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest) }; //Id will be the new generated user Id;

                return response;
            }

            string hashedPwd = EncryptionUtility.ComputeHash(register.Password, saltKey);

            AppUsers newUser = new AppUsers
            {
                AUFirstName = register.FirstName,
                AULastName = register.LastName,
                AUUserEmail = register.Email,
                AUPWHash = hashedPwd,
                AUPWSalt = saltKey,
                AUUserName = register.Email,
                AUNickName = string.Empty,
                AUCreateTime = DateTime.Now,
                AUChangeTime = DateTime.Now,
                AUExpiresTime = DateTime.Now.AddYears(1),
                AUGameCenterID = string.Empty,
                AUGameCenterUserName = string.Empty,
                AUAcctStatus = Convert.ToInt32(EnumUtils.AUAcctStatus.AccountActive),
                // for world
                AUUserClass = register.AUUserClass,
                AUWorldID = register.AUWorldID,
            };
            _db.Appusers.Add(newUser);
            await _db.SaveChangesAsync();

            Task.Run(() => CreateReward(newUser));
            await GenerateUserQRCode(newUser.AUID);
            response.Status = Messages.Ok;
            response.Data = new Response { Message = Messages.Success, Id = newUser.AUID }; //Id will be the new generated user Id;

            await SaveAppSpecificData(new AppSpecificData
            {
                ASID = newUser.AUID,
                ASOfficeID = register.ASOfficeID,
                ASBizAreaID = register.BizAreaID,
                ASChangeTime = DateTime.Now
            });
            return response;
        }

        private async Task CreateReward(AppUsers newUser)
        {
            var createAwardResponse = await ProcessCreateReward(newUser.AUID);

            if (createAwardResponse.Status == Messages.Ok)
            {
                newUser.AUDcoinAddress = createAwardResponse.Data.Address;
                await _db.SaveChangesAsync();
            }
        }

        private async Task<GenericResponse<CreateRewardResponse>> ProcessCreateReward(long targetUserId)
        {
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

            return createReward;
        }

        //wired up
        public async Task<GenericResponse<Response>> UpdateProfile(UpdateProfile appUser)
        {
            var result = new GenericResponse<Response>();
            var curUserDetail = new AppUserDetails();


            _userId = GetLoginUserId();

            AppUsers user = await _db.Appusers.FirstOrDefaultAsync(s => s.AUID == _userId);

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

            return result;
        }

        //wired up
        public async Task<GenericResponse<ProfileResponse>> GetUserProfile()
        {
            _userId = GetLoginUserId();


            var result = CreateResponse<ProfileResponse>(Messages.Ok, new ProfileResponse
            {
                AppUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _userId),
                AppUserDetail = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == _userId),
                AppSpecificData = await _db.AppSpecificData.FirstOrDefaultAsync(x => x.ASID == _userId)
            });

            return result;
        }

        //wired up
        public async Task<GenericResponse<AppUsers>> GetAppUserData()
        {
            _userId = GetLoginUserId();

            var appUser = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _userId);
            if (appUser == null)
            {
                return CreateResponse<AppUsers>(Messages.Fail, null, new Error { ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound), Message = Messages.NotFound });
            }

            return CreateResponse<AppUsers>(Messages.Ok, appUser);
        }

        //wired up
        public async Task<GenericResponse<AppUserDetails>> GetAppUserDetails()
        {
            _userId = GetLoginUserId();

            var appUser = await _db.AppUserDetails.FirstOrDefaultAsync(x => x.ADID == _userId);
            if (appUser == null)
            {
                return CreateResponse<AppUserDetails>(Messages.Fail, null, new Error { ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound), Message = Messages.NotFound });
            }

            return CreateResponse<AppUserDetails>(Messages.Ok, appUser);
        }

        //wired up
        public async Task<GenericResponse<AppSpecificData>> GetAppSpecificData()
        {
            _userId = GetLoginUserId();

            var data = await _db.AppSpecificData.FirstOrDefaultAsync(x => x.ASID == _userId);
            if (data == null)
            {
                return CreateResponse<AppSpecificData>(Messages.Fail, null, new Error { ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.NotFound), Message = Messages.NotFound });
            }

            return CreateResponse<AppSpecificData>(Messages.Ok, data);
        }

        //wired up
        public async Task<GenericResponse<LoginResponse>> RefreshSessionKey(RefreshSession session)
        {
            var userLogin = await _db.UserLogins.FirstOrDefaultAsync(x => x.SessionId == session.SessionKey);

            if (userLogin == null)
            {
                return CreateResponse<LoginResponse>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest),
                    Message = Messages.InvalidSessionId
                });
            }

            userLogin.SessionId = Guid.NewGuid().ToString();
            userLogin.ExpiryTime = DateTime.Now.AddDays(1);
            await _db.SaveChangesAsync();

            return CreateResponse<LoginResponse>(Messages.Fail, new LoginResponse
            {
                ExpiryTime = userLogin.ExpiryTime,
                SessionId = userLogin.SessionId
            });
        }

        //wired up
        public UserLogins GetUserLoginSession(string sessionKey)
        {
            var loggedInUser = _db.UserLogins.FirstOrDefault(x => x.SessionId == sessionKey);
            return loggedInUser;
        }

        //wired up
        public async Task<GenericResponse<BaseResponse>> ChangePassword(ChangePassword changePassword)
        {
            _userId = GetLoginUserId();

            string oldPwdHash = EncryptionUtility.ComputeHash(changePassword.OldPassword, saltKey);
            AppUsers user = await _db.Appusers.FirstOrDefaultAsync(x => x.AUID == _userId && x.AUPWHash == oldPwdHash);

            if (user == null)
            {
                return CreateResponse<BaseResponse>(Messages.Fail, null, new Error
                {
                    ErrorCode = Convert.ToInt32(EnumUtils.StatusCode.BadRequest),
                    Message = Messages.InvalidOldPwd
                });
            }

            user.AUPWHash = EncryptionUtility.ComputeHash(changePassword.NewPassword, saltKey);
            user.AUPWSalt = saltKey;
            await _db.SaveChangesAsync();

            return CreateResponse<BaseResponse>(Messages.Ok, new BaseResponse { Message = Messages.Success });

        }

        private async Task GenerateUserQRCode(long userId)
        {
            AppUserDetails userDetails = new AppUserDetails
            {
                ADChangeTime = DateTime.Now,
                ADLastPlayTime = DateTime.Now,
                ADID = userId,
                ADQRCodeVal = AppUtils.RandomString(8),
                ADLanguageCode = "EN"
            };

            _db.AppUserDetails.Add(userDetails);
            await _db.SaveChangesAsync();
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
