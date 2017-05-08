using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Utils
{

    public static class EnumExtensions
    {
        public static T GetAttribute<T>(this Enum value) where T : Attribute
        {
            var type = value.GetType();
            var memeberInfo = type.GetMember(value.ToString());
            var attributes = memeberInfo[0].GetCustomAttributes(typeof(T), false);
            return (T)attributes.FirstOrDefault();
        }

        public static string ToDisplayName(this Enum value)
        {
            var attribute = value.GetAttribute<DisplayAttribute>();
            return attribute == null ? value.ToString() : attribute.Name;
        }
    }

    public class EnumUtils
    {
        public enum StatusCode
        {
            Continue = 100,
            SwitchingProtocols = 101,
            OK = 200,
            Created = 201,
            Accepted = 202,
            NonAuthoritativeInformation = 203,
            NoContent = 204,
            ResetContent = 205,
            PartialContent = 206,
            MultipleChoices = 300,
            Ambiguous = 300,
            MovedPermanently = 301,
            Moved = 301,
            Found = 302,
            Redirect = 302,
            SeeOther = 303,
            RedirectMethod = 303,
            NotModified = 304,
            UseProxy = 305,
            Unused = 306,
            RedirectKeepVerb = 307,
            TemporaryRedirect = 307,
            BadRequest = 400,
            Unauthorized = 401,
            PaymentRequired = 402,
            Forbidden = 403,
            NotFound = 404,
            MethodNotAllowed = 405,
            NotAcceptable = 406,
            ProxyAuthenticationRequired = 407,
            RequestTimeout = 408,
            Conflict = 409,
            Gone = 410,
            LengthRequired = 411,
            PreconditionFailed = 412,
            RequestEntityTooLarge = 413,
            RequestUriTooLong = 414,
            UnsupportedMediaType = 415,
            RequestedRangeNotSatisfiable = 416,
            ExpectationFailed = 417,
            InternalServerError = 500,
            NotImplemented = 501,
            BadGateway = 502,
            ServiceUnavailable = 503,
            GatewayTimeout = 504,
            HttpVersionNotSupported = 505,
            UpgradeRequired = 426,
            
            LessQuantity=456,
            InsufficientBalance=457,
            InvalidItemId=458
        }

        public enum AUWorldID
        {
            Unknown = 0,
            PilotCohort1 = 1,                           // Main group of 200 interns testing the Pilot application
            PilotCohort2 = 2                            // Second, smaller group of interns also testing the Pilot
        };

        public enum AULoginTypeMask
        {
            Facebook = 1,
            [Display(Name = "Email Address")]
            EmailAddress = 2,                           // This is the only one initially supported
            GameCenter = 4
        };

        public enum AUUserClass
        {
            Standard = 1, //standard is an attendee
            Administrator = 2,
            Vendor = 3,
            Facilitator = 4
        };

        public enum AUAcctStatus
        {
            [Display(Name = "Account Inactive")]
            AccountInactive = 0,
            [Display(Name = "Account Active")]
            AccountActive = 1,
            [Display(Name = "Account Banned")]
            AccountBanned = -1,
            [Display(Name = "Account Closed")]
            AccountClosed = -2
        };

        public enum AUPrivLevel
        {
            [Display(Name = "Undefined No Access")]
            UndefinedNoAccess = 0,
            [Display(Name = "Guest User")]              // Can view but cannot add content or engage in transactions
            GuestUser = 10,
            [Display(Name = "Normal User")]             // Can log in, register for events, etc.
            NormalEndUser = 20,
            [Display(Name = "Group Leader")]            // Can add/remove users from groups but cannot change user status or view most reports
            GroupLeader = 40,
            [Display(Name = "Administrator")]           // Can view reports and change status of other users with lower privilege levels; can create/ban users
            Administrator = 60,
            [Display(Name = "Super User")]               // Can create other user and administrator accounts
            Superuser = 90
        };

        // ---- UserDemographicDetails Definitions ----

        public enum UDGender
        {
            Unknown = 0,
            Male = 1,
            Female = 2,
            [Display(Name = "Decline to State")]
            DeclineToState = 3
        };

        // ---- AppSpecificData Definitions ----

        public enum ASAppID
        {
            Unknown = 0,
            BlockchainPilot = 1                 // Pilot version of Deloitte "Blockchain App", June 2016
        };

        // ---- Device-Related Definitions ----

        public enum DevType
        {
            Unknown = 0,
            [Display(Name = "iPad")]
            iPad = 1,
            [Display(Name = "iPhone or iPod Touch")]
            Iphone = 2,
            [Display(Name = "Android Phone")]
            AndroidPhone = 3,
            [Display(Name = "Android Tablet")]
            AndroidTablet = 4,
            [Display(Name = "Windows Phone")]
            WindowsPhone = 5,
            [Display(Name = "Windows Tablet")]
            WindowsTablet = 6,
            [Display(Name = "Other Phone")]
            OtherPhone = 7,
            [Display(Name = "Other Tablet")]
            OtherTablet = 8,
            [Display(Name = "Windows Computer")]
            WindowsComputer = 9,
            [Display(Name = "MacOSX Computer")]
            MacOSXComputer = 10,
            [Display(Name = "Other Computer")]
            OtherComputer = 11,
            [Display(Name = "Smart TV")]
            SmartTV = 12,
            [Display(Name = "Other Smart Device")]
            OtherSmartDevice = 13,
            [Display(Name = "Other Device")]
            OtherDevice = 14
        };

        // ---- Apple In-App Purchase Definitions ----

        public enum IAReceiptStatus
        {
            [Display(Name = "status unknown (initial value when record is created)")]
            StatusUnknown = 0,
            [Display(Name = "Processing. Request queued for sending. Waiting for completion status")]
            Processing = 1,
            [Display(Name = "Verified. Receipt is valid. Action has not yet been taken, so this transaction is still considered pending.")]
            Verified = 2,
            [Display(Name = "Rejected. Receipt was reported by Apple as invalid, and no further actions may be taken with this record")]
            Rejected = 3,
            [Display(Name = "Processed. This approved record has been processed successfully. No further action can be taken with this record.")]
            Processed = 4,
            [Display(Name = "Failed. Our processing failed for some reason. This transaction did not take place as desired.")]
            Failed = 5,
        }

        public enum IAAppleStatusCode
        {
            Undefined = -1,
            Successful = 0,
            //non-0: Problem=
            Problem = 1
        };

        // ---- Item Catalog Definitions ----

        public enum ItemCategory
        {
            Undefined = 0,
            Physicalitem = 1,
            Virtualitem = 2,
            CharitableContribution = 3
        };

        public enum ItemDeliveryMode
        {
            Undefined = 0,
            [Display(Name = "pickup in physical store")]
            PickupInPhysicalStore = 1,
            [Display(Name = "ship to purchaser")]
            ShipToPurchaser = 2,
            [Display(Name = "electronic delivery")]
            ElectronicDelivery = 3,
            [Display(Name = "N/A (for charitable contributions, for example)")]
            NA_forCharitableContributions = 4
        }

        public enum ItemStatus
        {
            Undefined = 0,
            Available = 1,
            [Display(Name = "not currently available (out of stock)")]
            NotCurrentlyAvailable = 2,
            Discontinued = 3
        }

        // ---- Event-, Activity- and Badge-Related Definitions ----
        public enum EvtType                     // This is a rough list and likely to change after the Pilot release
        {
            Undefined = 0,
            TradeShow = 1,
            Conference = 2,
            Meeting = 3
        };

        public enum BadgeType                   // This is a rough list and likely to change after the Pilot release
        {
            Undefined = 0,
            IAmHelpful = 1
        };

        public enum BadgeModifier               // Future feature -- not currently supported
        {
            Undefined = 0
        };

        public enum ActType                     // This is a rough list and likely to change after the Pilot release
        {
            Undefined = 0,
            OneOnOneMeeting = 1,
            MeetAndGreet = 2
        };

        public enum ActTriggerFlags
        {
            SecondaryQRScanRequired = 1         // Completing Activity requires scanning a target user's QR Code
        };


        public enum ActivityType
        {
            OneTime = 0,
            Recurring = 1
        }


        public enum Mark
        {
            Awfull = 1,
            Bad = 2,
            NotBad = 3,
            Good = 4,
            Excelent = 5
        }

        public enum TransStatusCode
        {
            Undefined = 0,
            Successful = 1
        }
    }
}
