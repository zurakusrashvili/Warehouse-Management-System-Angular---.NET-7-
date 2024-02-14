using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.Stand
{
    public class StandDTO
    {
        [Key]
        public int Id { get; set; }
        public int WarehouseId { get; set; }
        public string StandName { get; set; }
        public virtual IList<Models.Location> Locations { get; set; }
    }
}