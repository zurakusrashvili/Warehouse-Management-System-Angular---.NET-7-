using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace IMS.Models
{
    public class SalesOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
    
        public double Quantity { get; set; }

        [Required]
        [ForeignKey("TransactionTypeId")] 
        public int TransactionTypeId { get; set; }

        public int? CustomerId { get; set; }
        public int? SupplierId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public double Total { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
