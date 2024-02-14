using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IMS.Models;

namespace IMS.Models.DTO.Stock
{
    public class StockDTO
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Models.Product Product { get; set; }

        [Required]
        public int UnitId { get; set; }

        [ForeignKey("UnitId")]
        public Models.Unit ProductUnit { get; set; }

        //Supplier
        [Required]
        public int SupplierId { get; set; }

        [ForeignKey("SupplierId")]
        public Models.Supplier Supplier { get; set; }

        [Required]
        public double PurchasePrice { get; set; }

        [Required]
        public double SalesPrice { get; set; }

        [Required]
        public int QtyInStock { get; set; }

        public double ValueOnHand { get; set; }

        [Required]
        public int LocationId { get; set; }

        [ForeignKey("LocationId")]
        public Models.Location Location { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
