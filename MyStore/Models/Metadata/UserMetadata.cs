using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyStore.Models.Metadata
{
    public class UserMetadata
    {
        [Required, StringLength(100)]
        [Display(Name = "Tên đăng nhập")]
        public string Username { get; set; }

        [Required, StringLength(255)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [Required]
        [RegularExpression("A|C", ErrorMessage = "A = Admin, C = Customer")]
        public char UserRole { get; set; }
    }

    [MetadataType(typeof(UserMetadata))]
    public partial class User { }
}