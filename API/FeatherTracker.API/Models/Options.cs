using CommandLine;

namespace FeatherTracker.API.Models
{
	public class Options
	{
		[Option("jwtsecret", Required = true)]
		public string JWTSecret { get; set; } = "";
		[Option("jwtlifetime", Required = true)]
		public int JWTLifetime { get; set; } = 120;
		[Option("dbconnectionstring", Required = true)]
		public string DBConnectionString { get; set; } = "";
	}
}
