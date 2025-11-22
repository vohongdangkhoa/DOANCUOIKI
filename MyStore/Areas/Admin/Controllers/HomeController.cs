using MyStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyStore.Areas.Admin.Controllers
{
    public class HomeController : Controller
    {
        // GET: Admin/Home
        private MyStoreEntities db = new MyStoreEntities();

        // GET: Home/Index
        public ActionResult Index()
        {
            // Lấy 12 sách mới nhất
            var books = db.Books
                          .OrderByDescending(b => b.BookID)
                          .Take(12)
                          .ToList();

            return View(books);
        }

        // GET: Home/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }

            Book book = db.Books.Find(id);
            if (book == null)
            {
                return HttpNotFound();
            }

            return View(book);
        }

        // GET: Home/About
        public ActionResult About()
        {
            ViewBag.Message = "Trang giới thiệu về cửa hàng.";
            return View();
        }

        // GET: Home/Contact
        public ActionResult Contact()
        {
            ViewBag.Message = "Trang liên hệ với cửa hàng.";
            return View();
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