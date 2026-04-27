using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.COR.Models.Shared.Birds
{
	public class ListBirdModel
	{
		[JsonPropertyName("id")]
		public Guid ID { get; set; }
		public string Name { get; set; }
		public string Type { get; set; }
		public string Icon { get; set; }
		public DateTime BirthDate { get; set; }
		public DateTime? UpdatedAt { get; set; }
	}
}
