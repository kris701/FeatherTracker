using DatabaseSharp.Models;
using System.Text.Json.Serialization;

namespace FeatherTracker.API.Tools
{
	public abstract class BaseExecIDModel
	{
		[JsonIgnore]
		[DatabaseSharpIgnore(IgnoreAsParameter = false)]
		public Guid ExecID { get; set; }
	}
}
