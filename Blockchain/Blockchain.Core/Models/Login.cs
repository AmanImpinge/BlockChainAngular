using Blockchain.Core.Dal.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Login
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class ForgotPassword
    {
        [Required]
        public string Email { get; set; }
    }

    public class LoginResponse
    {
        public string SessionId { get; set; }
        public DateTime ExpiryTime { get; set; }
    }

    public class TransferPointsResponse
    {
        public string SessionId { get; set; }
    }
    public class ProfileResponse
    {
        //todo: move this if its in wrong spot
        //fix naming if they are bad?

        public AppUsers AppUser { get; set; }
        public AppUserDetails AppUserDetail { get; set; }
        public AppSpecificData AppSpecificData { get; set; }
    }
    public class ProfileListResponse
    {//todo: move this if its in wrong spot

        public List<AppUsers> appUsers { get; set; }
    }

    public class MarketPlacetResponse
    {//todo: move this if its in wrong spot

        public List<ItemCatalog> Items { get; set; }
    }

    public class RefreshSession
    {
        [Required]
        public string SessionKey { get; set; }
    }

    public class ChangePassword
    {
        [Required]
        [DataType(DataType.Password)]
        public string OldPassword { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("NewPassword")]
        public string ConfirmNewPassword { get; set; }
    }
}