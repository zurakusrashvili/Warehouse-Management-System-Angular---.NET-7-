﻿using System.ComponentModel.DataAnnotations;

namespace IMS.Models
{
    public class Unit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}