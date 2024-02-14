using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IMS.Models
{
    public class Subcategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(ProductCategoryId))]
        public int ProductCategoryId { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }

        [Required]
        public string UserId { get; set; }

        public virtual IList<Product> Products { get; set; }
    }
}