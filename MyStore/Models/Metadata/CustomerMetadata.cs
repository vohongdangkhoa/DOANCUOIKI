using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyStore.Models.Metadata
{
    public class CustomerMetadata
    {
        public int CustomerID { get; set; }

        [Required(ErrorMessage = "Tên khách hàng bắt buộc")]
        [StringLength(200)]
        [Display(Name = "Tên khách hàng")]
        public string CustomerName { get; set; }

        [Required(ErrorMessage = "Số điện thoại bắt buộc")]
        [StringLength(15)]
        [Display(Name = "Điện thoại")]
        public string CustomerPhone { get; set; }

        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        [StringLength(200)]
        [Display(Name = "Email")]
        public string CustomerEmail { get; set; }

        [StringLength(300)]
        [Display(Name = "Địa chỉ")]
        public string CustomerAddress { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }
    }

    [MetadataType(typeof(CustomerMetadata))]
    public partial class Customer { }
}