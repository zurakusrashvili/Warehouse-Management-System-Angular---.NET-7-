using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.SalesOrderStatus
{
    public class SalesOrderStatusCreateDTO
    {
        [Required]
        public string Name { get; set; }
        public string? UserId { get; set; }
    }
}
