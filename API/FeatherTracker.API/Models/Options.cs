using CommandLine;

namespace FeatherTracker.API.Models
{
	public class Options
	{
		[Option("jwtlifetime", Required = true)]
		public int JWTLifetime { get; set; } = 120;
		[Option("apiUrl", Required = true)]
		public string APIUrl { get; set; } = "";
		[Option("dbconnectionstring", Required = true)]
		public string DBConnectionString { get; set; } = "";
	}
}
