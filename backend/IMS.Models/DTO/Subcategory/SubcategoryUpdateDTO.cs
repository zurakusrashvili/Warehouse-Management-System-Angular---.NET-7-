using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.Subcategory
{
    public class SubcategoryUpdateDTO
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductCategoryId { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }

        public string? UserId { get; set; }
    }
}
