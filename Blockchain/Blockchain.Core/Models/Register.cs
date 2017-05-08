using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Models
{
    public class Register : UpdateProfile
    {
        //public string Address { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        public string AUDcoinAddress { get; set; }

    }

    public class UpdateProfile
    {
        [Required]
        public string FirstName { get; set; }

        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string NickName { get; set; }


        // new cols
        public int AUWorldID { get; set; }
        public int AUUserClass { get; set; }
        public string ProfilePic { get; set; }

        public long Id { get; set; }

        public int BizAreaID { get; set; }
        public int ASOfficeID { get; set; }
    }
}
