using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.Location
{
    public class LocationDTO
    {
                [Key]
                public int Id { get; set; }

                [ForeignKey(nameof(StandId))]
                public int StandId { get; set; }

                [Required]
                public int ShelfNumber { get; set; }

                [Required]
                public int PlaceNumber { get; set; }

                public string? UserId { get; set; }

                [NotMapped]
                public virtual IList<Models.Product> Products { get; set; }
    }
}
