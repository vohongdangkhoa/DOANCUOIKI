using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PagedList.Mvc;


namespace MyStore.Models.ViewModel
{
    public class BookSearchVM
    {
        public string Keyword { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string SortOrder { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; } = 10;
        public  PagedList.IPagedList<Book> Books { get; set; }
    }
}