using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyStore.Models;

namespace MyStore.Controllers
{
    public class BooksController : Controller
    {
        private MyStoreEntities db = new MyStoreEntities();

        // GET: Books - Hiển thị tất cả sách, có thể lọc theo danh mục và tìm kiếm
        public ActionResult Index(int? categoryId, string searchString)
        {
            var books = db.Books.Include("Category").AsQueryable();

            // Lọc theo danh mục nếu có
            if (categoryId.HasValue)
            {
                books = books.Where(b => b.CategoryID == categoryId.Value);
                ViewBag.CategoryName = db.Categories.Find(categoryId.Value)?.CategoryName;
            }

            // Tìm kiếm theo tên sách hoặc tác giả
            if (!string.IsNullOrEmpty(searchString))
            {
                books = books.Where(b => b.BookTitle.Contains(searchString) ||
                                        b.Author.Contains(searchString));
            }

            // Truyền danh sách categories cho dropdown
            ViewBag.Categories = db.Categories.ToList();
            ViewBag.SearchString = searchString;

            return View(books.ToList());
        }

        // GET: Books/Details/5 - Hiển thị chi tiết sách
        public ActionResult Details()
        {
            // Chuyển hướng về trang danh sách sách nếu không có id
            return RedirectToAction("Index");

            // Hoặc hiển thị thông báo lỗi
            // return View("Error", new HandleErrorInfo(
            //     new Exception("Thiếu tham số ID sách"), "Books", "Details"));
        }

        // GET: Books/Category/5 - Hiển thị sách theo danh mục (có thể dùng Index thay thế)
        public ActionResult Category(int id)
        {
            var category = db.Categories.Find(id);
            if (category == null)
                return HttpNotFound();

            var books = db.Books
                .Include("Category")
                .Where(b => b.CategoryID == id)
                .ToList();

            ViewBag.CategoryName = category.CategoryName;
            return View(books);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        // GET: Books/GetBooksByCategory - Load sách cùng danh mục (cho AJAX)
        public ActionResult GetBooksByCategory(int categoryId, int? excludeId = null)
        {
            var books = db.Books
                .Include("Category")
                .Where(b => b.CategoryID == categoryId && b.BookID != excludeId)
                .Take(4)
                .ToList();

            return PartialView("_RelatedBooks", books);
        }
        public ActionResult Details(int id)
        {
            var book = db.Books.FirstOrDefault(b => b.BookID == id);

            if (book == null)
                return HttpNotFound();

            return View(book);
        }

    }
}