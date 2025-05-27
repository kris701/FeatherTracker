using PrimeNGTemplate.API.Tools;

namespace PrimeNGTemplate.Plugins.Core.Models.Shared.Authentication
{
	public class UpdatePasswordInput : BaseExecIDModel
	{
		public string OldPassword { get; set; }
		public string NewPassword { get; set; }
	}
}
