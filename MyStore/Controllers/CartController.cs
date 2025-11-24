using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MyStore.Models;

namespace MyStore.Controllers
{
    public class ShoppingCartsController : Controller
    {
        private MyStoreEntities db = new MyStoreEntities();

        public ActionResult Index()
        {
            var cart = GetCart();
            return View(cart);
        }

        [HttpPost]
        public ActionResult AddToCart(int bookId, int quantity = 1)
        {
            var book = db.Books.Find(bookId);
            if (book == null)
                return HttpNotFound();

            var cart = GetCart();
            var existingItem = cart.FirstOrDefault(item => item.BookID == bookId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                cart.Add(new CartItem
                {
                    BookID = book.BookID,
                    BookTitle = book.BookTitle,
                    Price = book.Price,
                    Image = book.Image ?? "/Content/images/default-book.jpg",
                    Quantity = quantity
                });
            }

            SaveCart(cart);
            TempData["SuccessMessage"] = "Đã thêm vào giỏ hàng!";

            return RedirectToAction("Detail", "Product", new { id = bookId });
        }

        [HttpPost]
        public ActionResult AddToCartAjax(int bookId, int quantity = 1)
        {
            try
            {
                var book = db.Books.Find(bookId);
                if (book == null)
                    return Json(new { success = false, message = "Sách không tồn tại!" });

                var cart = GetCart();
                var existingItem = cart.FirstOrDefault(item => item.BookID == bookId);

                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                }
                else
                {
                    cart.Add(new CartItem
                    {
                        BookID = book.BookID,
                        BookTitle = book.BookTitle,
                        Price = book.Price,
                        Image = book.Image ?? "/Content/images/default-book.jpg",
                        Quantity = quantity
                    });
                }

                SaveCart(cart);

                return Json(new
                {
                    success = true,
                    message = "Đã thêm vào giỏ hàng!",
                    cartCount = cart.Sum(cartItem => cartItem.Quantity) // SỬA Ở ĐÂY
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        [HttpPost]
        public ActionResult UpdateQuantity(int bookId, int quantity)
        {
            var cart = GetCart();
            var item = cart.FirstOrDefault(i => i.BookID == bookId);

            if (item != null)
            {
                if (quantity <= 0)
                {
                    cart.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                }
                SaveCart(cart);
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult UpdateQuantityAjax(int bookId, int quantity)
        {
            try
            {
                var cart = GetCart();
                var item = cart.FirstOrDefault(i => i.BookID == bookId);

                if (item != null)
                {
                    if (quantity <= 0)
                    {
                        cart.Remove(item);
                    }
                    else
                    {
                        item.Quantity = quantity;
                    }
                    SaveCart(cart);
                }

                return Json(new
                {
                    success = true,
                    cartCount = cart.Sum(cartItem => cartItem.Quantity), // SỬA Ở ĐÂY
                    total = cart.Sum(cartItem => cartItem.Total) // SỬA Ở ĐÂY
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult RemoveFromCart(int bookId)
        {
            var cart = GetCart();
            var item = cart.FirstOrDefault(i => i.BookID == bookId);

            if (item != null)
            {
                cart.Remove(item);
                SaveCart(cart);
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult RemoveFromCartAjax(int bookId)
        {
            try
            {
                var cart = GetCart();
                var item = cart.FirstOrDefault(i => i.BookID == bookId);

                if (item != null)
                {
                    cart.Remove(item);
                    SaveCart(cart);
                }

                return Json(new
                {
                    success = true,
                    cartCount = cart.Sum(cartItem => cartItem.Quantity) // SỬA Ở ĐÂY
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public ActionResult GetCartCount()
        {
            var cart = GetCart();
            var count = cart.Sum(cartItem => cartItem.Quantity); // SỬA Ở ĐÂY
            return Json(new { count }, JsonRequestBehavior.AllowGet);
        }

        private List<CartItem> GetCart()
        {
            var cart = Session["Cart"] as List<CartItem>;
            if (cart == null)
            {
                cart = new List<CartItem>();
                Session["Cart"] = cart;
            }
            return cart;
        }

        private void SaveCart(List<CartItem> cart)
        {
            Session["Cart"] = cart;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}