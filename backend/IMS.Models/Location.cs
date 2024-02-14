using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IMS.Models
{
    public class Location
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(StandId))]
        public int StandId { get; set; }

        [Required]
        public int ShelfNumber { get; set; }

        [Required]
        public int PlaceNumber { get; set; }

        [Required]
        public string UserId { get; set; }
        
        [NotMapped]
        public virtual IList<Stock> Stocks { get; set; }
    }
}