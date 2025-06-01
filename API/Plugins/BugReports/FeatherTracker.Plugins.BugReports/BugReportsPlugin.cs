using DatabaseSharp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Uni.API.Models;

namespace FeatherTracker.Plugins.BugReports
{
	public class BugReportsPlugin : BaseUniAPIPlugin
	{
		public const string DBClientKeyName = "BugReports_ConnectionString";
		public const string PluginName = "bugreports";

		private string _connectionString = "";

		public BugReportsPlugin() : base(
			new Guid("891577d2-0490-4c4b-89d6-21b4210aacf8"),
			"HelForm Bug Reports",
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
			services.AddHostedService<Services.PermissionBackgroundService>();

			services.AddSwaggerGen(c =>
			{
				var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
				c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
			});

			base.ConfigureServices(services);
		}

		private string GetSectionValue(IConfiguration configuration, string key)
		{
			var str = configuration.GetSection("BugReports")[key];
			if (str == null)
				throw new Exception($"'{key}' for plugin was not set in IConfiguration!");
			return str;
		}
	}
}
