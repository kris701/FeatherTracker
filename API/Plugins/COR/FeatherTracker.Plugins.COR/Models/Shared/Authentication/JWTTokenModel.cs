using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.COR.Models.Shared.Authentication
{
	public class JWTTokenModel
	{
		[JsonPropertyName("nameid")]
		public string NameID { get; set; }
		[JsonPropertyName("iat")]
		public int IssuedAt { get; set; }
		[JsonPropertyName("exp")]
		public int Expires { get; set; }
	}
}
