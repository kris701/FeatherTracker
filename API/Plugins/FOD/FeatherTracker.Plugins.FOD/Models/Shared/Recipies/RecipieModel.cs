using DatabaseSharp.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.FOD.Models.Shared.Recipies
{
	public class RecipieModel
	{
		[JsonPropertyName("id")]
		[Required]
		public Guid ID { get; set; }
		[Required]
		public string Name { get; set; }
		[Required] 
		public string Recipie { get; set; }
		[Required] 
		public double Quantity { get; set; }
		[Required]
		public string Unit { get; set; }
		[Required]
		[DatabaseSharp(FillTable = 1, ColumnName = "FK_BirdID")]
		public List<Guid> Birds { get; set; }


		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime CreatedAt { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime? UpdatedAt { get; set; }
	}
}
