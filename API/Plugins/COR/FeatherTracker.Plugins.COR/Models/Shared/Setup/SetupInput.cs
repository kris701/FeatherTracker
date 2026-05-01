using FeatherTracker.Plugins.COR.Models.Shared.Authentication;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FeatherTracker.Plugins.COR.Models.Shared.Setup
{
	public class SetupInput
	{
		[Required]
		public AuthRequest User { get; set; }
	}
}
