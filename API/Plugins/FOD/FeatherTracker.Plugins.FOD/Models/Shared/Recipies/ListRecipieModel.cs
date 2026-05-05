using DatabaseSharp.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.FOD.Models.Shared.Recipies
{
	public class ListRecipieModel
	{
		[JsonPropertyName("id")]
		[Required]
		public Guid ID { get; set; }
		[Required]
		public string Name { get; set; }

		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime CreatedAt { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime? UpdatedAt { get; set; }
	}
}
