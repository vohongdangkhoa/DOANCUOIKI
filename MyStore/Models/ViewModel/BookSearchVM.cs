using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyStore.Models.ViewModel
{
    public class BookSearchVM
    {
        public string Keyword { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string SortOrder { get; set; }
        public List<Book> Books { get; set; }
    }
}