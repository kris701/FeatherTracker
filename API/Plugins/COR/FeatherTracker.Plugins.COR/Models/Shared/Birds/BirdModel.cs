using DatabaseSharp.Attributes;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.COR.Models.Shared.Birds
{
	public class BirdModel
	{
		[JsonPropertyName("id")]
		[Required]
		public Guid ID { get; set; }
		[Required]
		public string Name { get; set; }
		[Required]
		public string Description { get; set; }
		[Required]
		public string Type { get; set; }
		[Required]
		public string Icon { get; set; }
		[Required]
		public DateTime BirthDate { get; set; }

		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime CreatedAt { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime? UpdatedAt { get; set; }
	}
}
