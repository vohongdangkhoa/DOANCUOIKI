using MyStore.Models;
using MyStore.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyStore.Controllers
{
    public class AccountController : Controller
    {
            private MyStoreEntities db = new MyStoreEntities();

            // GET: Register
            public ActionResult Register()
            {
                return View();
            }

            // POST: Register
            [HttpPost]
            [ValidateAntiForgeryToken]
            public ActionResult Register(RegisterViewModel model)
            {
                if (ModelState.IsValid)
                {
                    // 1. Kiểm tra username trùng
                    var checkUser = db.Users.SingleOrDefault(u => u.Username == model.Username);
                    if (checkUser != null)
                    {
                        ViewBag.Error = "Tên đăng nhập đã tồn tại!";
                        return View(model);
                    }

                    // 2. Tạo User
                    User user = new User
                    {
                        Username = model.Username,
                        Password = model.Password, // Có thể mã hoá sau
                        UserRole = "C"
                    };
                    db.Users.Add(user);
                    db.SaveChanges();

                    // 3. Tạo Customer
                    Customer customer = new Customer
                    {
                        CustomerName = model.CustomerName,
                        CustomerPhone = model.CustomerPhone,
                        CustomerEmail = model.CustomerEmail,
                        CustomerAddress = model.CustomerAddress,
                        Username = model.Username
                    };
                    db.Customers.Add(customer);
                    db.SaveChanges();

                    // 4. Chuyển hướng về Login
                    return RedirectToAction("Login");
                }

                return View(model);
            }
        public ActionResult Login()
        {
            return View();
        }

        // ============= LOGIN (POST) =============
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(string username, string password)
        {
            // Tìm user trong bảng User
            var user = db.Users.SingleOrDefault(u => u.Username == username && u.Password == password);

            if (user == null)
            {
                ViewBag.Error = "Sai tên đăng nhập hoặc mật khẩu!";
                return View();
            }

            // Lưu SESSION
            Session["Username"] = user.Username;
            Session["UserRole"] = user.UserRole;

            // Nếu là Customer → về Home
            if (user.UserRole == "C")
            {
                return RedirectToAction("Index", "Home");
            }

            // Nếu là Admin → chuyển đến trang Admin
            if (user.UserRole == "A")
            {
                return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
            }

            return RedirectToAction("Index", "Home");
        }

        // ============= LOGOUT =============
        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Login");
        }
    }
}