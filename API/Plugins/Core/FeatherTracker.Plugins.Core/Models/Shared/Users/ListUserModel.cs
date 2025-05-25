using DatabaseSharp.Models;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Core.Models.Shared.Users
{
	public class ListUserModel
	{
		[DatabaseSharp(ColumnName = "PK_ID")]
		[JsonPropertyName("id")]
		public Guid ID { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public int PermissionsCount { get; set; }
		public bool IsActive { get; set; }
		public bool IsStaff { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? UpdatedAt { get; set; }
	}
}
