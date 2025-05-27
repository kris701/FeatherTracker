using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FeatherTracker.Plugins.Core.Models.Shared.Users
{
	public class UserModel : BaseExecIDModel
	{
		[DatabaseSharp(ColumnName = "PK_ID")]
		[JsonPropertyName("id")]
		public Guid ID { get; set; }
		[Required]
		public string FirstName { get; set; }
		[Required]
		public string LastName { get; set; }

		[Required]
		public string Email { get; set; }

		[Required]
		public string LoginName { get; set; }

		[Required]
		[DatabaseSharp(FillTable = 1, ColumnName = "FK_Permission_ID")]
		public List<string> Permissions { get; set; }
		[Required]
		public bool IsActive { get; set; }
		[Required]
		public bool IsStaff { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime CreatedAt { get; set; }
		[DatabaseSharpIgnore(IgnoreAsFill = false)]
		public DateTime? UpdatedAt { get; set; }
	}
}
