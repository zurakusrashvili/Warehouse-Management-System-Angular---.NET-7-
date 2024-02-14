using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.Stock
{
    public class StockUpdateDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int UnitId { get; set; }
        //Supplier
        [Required]
        public int SupplierId { get; set; }
        [Required]
        public double PurchasePrice { get; set; }
        [Required]
        public double SalesPrice { get; set; }
        [Required]
        public int QtyInStock { get; set; }
        public double ValueOnHand { get; set; }
        [Required]
        public int LocationId { get; set; }    
        public string? UserId { get; set; }

    }
}
