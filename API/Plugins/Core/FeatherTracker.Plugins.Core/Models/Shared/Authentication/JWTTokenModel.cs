using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Core.Models.Shared.Authentication
{
	public class JWTTokenModel
	{
		[JsonPropertyName("nameid")]
		public string NameID { get; set; }
		[JsonPropertyName("role")]
		public List<string> Roles { get; set; }
		[JsonPropertyName("isstaff")]
		public string IsStaff { get; set; }
		[JsonPropertyName("iat")]
		public int IssuedAt { get; set; }
		[JsonPropertyName("exp")]
		public int Expires { get; set; }
	}
}
