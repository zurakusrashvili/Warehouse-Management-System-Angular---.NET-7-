﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.Models.DTO.TransactionType
{
    public class TransactionTypeCreateDTO
    {

        [Required]
        public string Name { get; set; }
    }
}
