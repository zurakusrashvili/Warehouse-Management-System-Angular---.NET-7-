using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.Location
{
    public class LocationUpdateDTO
    {
               [Key]
               public int Id { get; set; }

               public int StandId { get; set; }

               [Required]
               public int ShelfNumber { get; set; }

               [Required]
               public int PlaceNumber { get; set; }

               public string? UserId { get; set; }
    }
}
