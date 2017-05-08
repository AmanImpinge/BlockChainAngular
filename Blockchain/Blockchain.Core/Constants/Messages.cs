using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Constants
{
    public class Messages
    {
        public const string Success = "Success";
        public const string InvalidPassword = "Password is not valid";
        public const string InvalidEmail = "Email is not valid";
        public const string Ok = "OK";
        public const string Fail = "FAIL";
        public const string MissingSessionId = "SessionId missing in headers.";
        public const string InvalidSessionId = "Invalid SessionId";
        public const string EmailAlreadyExists = "User with this email already registered.";
        public const string NotFound = "Not Found";
        public const string ProfileUpdated = "Profile has been updated.";
        public const string SessionKeyExpired = "SessionId has been expired.";
        public const string UserEmailNotExists = "User with this email doesn't exists.";
        public const string InvalidOldPwd = "Invalid old password.";
        public const string FromAddressNotFound = "From Address not found";
        public const string TargetAddressNotFound = "Target Address not found";
        public const string TargetUserNotFound = "Target user info not found";

        public const string RewardAlreadyCreated = "Reward already created for this user.";
        public const string FromUserHasNotEnoughMoney = "From user doesn't have enough money to transfer.";
        public const string InvalidFromUserId = "Invalid from user id.";
        public const string InvalidTargetUserId = "Invalid target user id.";
        public const string TargetUserDetailsNotFound = "Target user details not found.";

        public const string LessQuantity = "Quantity is less available.";
        public const string InsufficientBalance = "Insufficient Balance";

        public const string InvalidItemId = "Invalid Item Id";
        public const string StartDateTimeShuoldBeLess = "Start date time should be less than the end date time.";
        public const string InvalidVendorId = "Invalid vendor id";
    }
}
