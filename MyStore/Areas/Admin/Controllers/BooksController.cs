using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MyStore.Models;
using MyStore.Models.ViewModel;
using PagedList;
using PagedList.Mvc;

namespace MyStore.Areas.Admin.Controllers
{
    public class BooksController : Controller
    {
        private MyStoreEntities db = new MyStoreEntities();

        // GET: Admin/Books
        public ActionResult Index(string keyword, decimal? minPrice, decimal? maxPrice, string sortOrder, int page = 1)
        {
            var books = db.Books.Include(b => b.Category).AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
                books = books.Where(b => b.BookTitle.Contains(keyword));

            if (minPrice.HasValue)
                books = books.Where(b => b.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                books = books.Where(b => b.Price <= maxPrice.Value);

            switch (sortOrder)
            {
                case "price_asc": books = books.OrderBy(b => b.Price); break;
                case "price_desc": books = books.OrderByDescending(b => b.Price); break;
                case "title_asc": books = books.OrderBy(b => b.BookTitle); break;
                case "title_desc": books = books.OrderByDescending(b => b.BookTitle); break;
                default: books = books.OrderBy(b => b.BookID); break;
            }

            ViewBag.CurrentSort = sortOrder;

            int pageSize = 4; // Số sách mỗi trang
            var pagedBooks = books.ToPagedList(page, pageSize);

            var vm = new BookSearchVM
            {
                Keyword = keyword,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                SortOrder = sortOrder,
                PageNumber = page,
                PageSize = pageSize,
                Books = pagedBooks
            };

            return View(vm);
        }


        // GET: Admin/Books/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Book book = db.Books.Find(id);
            if (book == null)
            {
                return HttpNotFound();
            }
            return View(book);
        }

        // GET: Admin/Books/Create
        public ActionResult Create()
        {
            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName");
            return View();
        }

        // POST: Admin/Books/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "BookID,CategoryID,BookTitle,Description,Price,Image,PublishYear,Stock")] Book book)
        {
            if (ModelState.IsValid)
            {
                db.Books.Add(book);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName", book.CategoryID);
            return View(book);
        }

        // GET: Admin/Books/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Book book = db.Books.Find(id);
            if (book == null)
            {
                return HttpNotFound();
            }
            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName", book.CategoryID);
            return View(book);
        }

        // POST: Admin/Books/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "BookID,CategoryID,BookTitle,Description,Price,Image,PublishYear,Stock")] Book book)
        {
            if (ModelState.IsValid)
            {
                db.Entry(book).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryID = new SelectList(db.Categories, "CategoryID", "CategoryName", book.CategoryID);
            return View(book);
        }

        // GET: Admin/Books/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Book book = db.Books.Find(id);
            if (book == null)
            {
                return HttpNotFound();
            }
            return View(book);
        }

        // POST: Admin/Books/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Book book = db.Books.Find(id);
            db.Books.Remove(book);
            db.SaveChanges();
            return RedirectToAction("Index");
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
