using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace IMS.Models.DTO.Product;

public class ProductUpdateDTO
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }

    public string? ImageName { get; set; }

    [Required]
    public int ProductCategoryId { get; set; }


    //Subcategory
    [Required]
    public int SubcategoryId { get; set; }
    
    public string? UserId { get; set; }


    [NotMapped]
    public IFormFile? ImageFile { get; set; }
}
