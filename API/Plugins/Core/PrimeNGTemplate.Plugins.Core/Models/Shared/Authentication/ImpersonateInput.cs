using PrimeNGTemplate.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace PrimeNGTemplate.Plugins.Core.Models.Shared.Authentication
{
	public class ImpersonateInput : BaseExecIDModel
	{
		[Required]
		public Guid TargetUser { get; set; }
	}
}
