using DatabaseSharp;
using FeatherTracker.Plugins.Birds.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Uni.API.Models;

namespace FeatherTracker.Plugins.Birds
{
	public class BirdsPlugin : BaseUniAPIPlugin
	{
		public const string DBClientKeyName = "Birds_ConnectionString";

		private string _connectionString = "";

		public BirdsPlugin() : base(
			new Guid("73fbc588-a637-49f3-9ece-8d578cd7cd8a"),
			"FeatherTracker Birds",
			new List<Guid>()
			{
				new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4")
			})
		{
		}

		public override void ConfigureConfiguration(IConfiguration configuration)
		{
			_connectionString = GetSectionValue(configuration, "DatabaseConnectionString");

			base.ConfigureConfiguration(configuration);
		}

		public override void ConfigureServices(IServiceCollection services)
		{
			services.AddKeyedSingleton<IDBClient>(DBClientKeyName, new DBClient(_connectionString));
			services.AddHostedService<PermissionBackgroundService>();

			base.ConfigureServices(services);
		}

		private string GetSectionValue(IConfiguration configuration, string key)
		{
			var str = configuration.GetSection("Birds")[key];
			if (str == null)
				throw new Exception($"'{key}' for plugin was not set in IConfiguration!");
			return str;
		}
	}
}
