using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FeatherTracker.Plugins.COR.Models.Shared.Authentication
{
	public class AuthUser
	{
		[Required]
		public string Username { get; set; }
		[Required]
		public string PasswordHash { get; set; }
	}
}
