﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.Stand
{
    public class StandCreateDTO
    {
        public int WarehouseId { get; set; }
        public string StandName { get; set; }
        public string? UserId { get; set; }
    }
}
