using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyStore.Models
{
    public class HomeViewModel
    {
        public List<Book> FeaturedBooks { get; set; }
        public List<Category> Categories { get; set; }
        public List<Book> NewArrivals { get; set; }
    }

    public class CartItem
    {
        public int BookID { get; set; }
        public string BookTitle { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Total => Price * Quantity;
    }
}