using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IMS.Models
{
    public class Stand
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public int WarehouseId { get; set; }

        public string StandName { get; set; }

        [Required]
        public string UserId { get; set; }


        public virtual IList<Location> Locations { get; set; }
    }
}