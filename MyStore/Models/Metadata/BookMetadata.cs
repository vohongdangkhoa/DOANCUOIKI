using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyStore.Models.Metadata
{
    public class BookMetadata
    {
        [Display(Name = "Mã sách")]
        public int BookID { get; set; }

        [Required(ErrorMessage = "Tên sách là bắt buộc")]
        [StringLength(300, ErrorMessage = "Tên sách tối đa 300 ký tự")]
        [Display(Name = "Tên sách")]
        public string BookTitle { get; set; }

        [Display(Name = "Mô tả")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Giá là bắt buộc")]
        [Range(0, 9999999, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
        [Display(Name = "Giá")]
        public decimal Price { get; set; }

        [StringLength(300)]
        [Display(Name = "Ảnh")]
        public string Image { get; set; }

        [Display(Name = "Năm xuất bản")]
        public int? PublishYear { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn phải >= 0")]
        [Display(Name = "Tồn kho")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "Danh mục là bắt buộc")]
        [Display(Name = "Danh mục")]
        public int CategoryID { get; set; }
    }

    // Partial class "buddy" nối metadata với lớp Book được EF sinh
    [MetadataType(typeof(BookMetadata))]
    public partial class Book
    {
        // Không cần thêm gì ở đây. Đây là partial để EF class và metadata kết nối.
    }

}