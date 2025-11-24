using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyStore.Models;

namespace MyStore.Controllers
{
    public class HomeController : Controller
    {
        private MyStoreEntities db = new MyStoreEntities();

        public ActionResult Index()
        {
            var model = new HomeViewModel
            {
                FeaturedBooks = db.Books
                    .Include("Category")
                    .OrderByDescending(b => b.Stock)
                    .Take(12)
                    .ToList(),

                Categories = db.Categories
                    .OrderBy(c => c.CategoryName)
                    .Take(8)
                    .ToList(),

                NewArrivals = db.Books
                    .Include("Category")
                    .OrderByDescending(b => b.BookID)
                    .Take(8)
                    .ToList()
            };

            return View(model);
        }

        public ActionResult Search(string q)
        {
            if (string.IsNullOrEmpty(q))
                return RedirectToAction("Index");

            var books = db.Books
                .Include("Category")
                .Where(b => b.BookTitle.Contains(q) || b.Description.Contains(q))
                .ToList();

            ViewBag.SearchQuery = q;
            return View(books);
        }
        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }
    }
}