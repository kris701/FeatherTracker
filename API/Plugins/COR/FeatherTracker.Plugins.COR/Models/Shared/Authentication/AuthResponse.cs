using System;
using System.Collections.Generic;
using System.Text;

namespace FeatherTracker.Plugins.COR.Models.Shared.Authentication
{
	public class AuthResponse
	{
		public string Username { get; set; }
		public string Token { get; set; }

		public AuthResponse(string username, string token)
		{
			Username = username;
			Token = token;
		}
	}
}
