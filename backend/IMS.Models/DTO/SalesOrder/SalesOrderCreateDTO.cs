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
    public class SalesOrderCreateDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        [Required]
        public int TransactionTypeId { get; set; }

        public int? CustomerId { get; set; }
        public int? SupplierId { get; set; }
        public int UnitId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }
     
        // public double Subtotal { get; set; }
        //
        // public double Tax { get; set; }

        public double? Total { get; set; }

        public string? UserId { get; set; }
    }
}
