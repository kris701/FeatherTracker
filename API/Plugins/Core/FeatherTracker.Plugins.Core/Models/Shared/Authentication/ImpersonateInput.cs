using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Core.Models.Shared.Authentication
{
	public class ImpersonateInput : BaseExecIDModel
	{
		[Required]
		public Guid TargetUser { get; set; }
	}
}
