using Microsoft.Extensions.Configuration;

namespace FeatherTracker.API.Tools.Helpers
{
	public static class ConfigurationHelpers
	{
		public static bool DoesSectionExist(IConfiguration configuration, string section) => configuration.GetSection(section) != null;

		public static string GetSectionValue(IConfiguration configuration, string section, string key)
		{
			var str = configuration.GetSection(section)[key];
			if (str == null)
				throw new Exception($"'{key}' for section '{section}' was not set in IConfiguration!");
			return str;
		}
	}
}
