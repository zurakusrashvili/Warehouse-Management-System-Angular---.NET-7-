using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace IMS.Models
{
    public class SalesOrderUpdateDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
      
        public int ProductId { get; set; }
        public double Quantity { get; set; }
        [AllowNull]
        public int CustomerId { get; set; }
        [AllowNull]
        public int SupplierId { get; set; }
        public DateTime OrderDate { get; set; }
        // public double Subtotal { get; set; }
        // public double Tax { get; set; }
        public double? Total { get; set; }
        public string? UserId { get; set; }
    }
}
