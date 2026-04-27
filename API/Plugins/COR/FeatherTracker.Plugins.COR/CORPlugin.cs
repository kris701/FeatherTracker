using DatabaseSharp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Uni.API.Helpers;
using Uni.API.Models;

namespace FeatherTracker.Plugins.COR
{
	public class CORPlugin : BaseUniAPIPlugin
	{
		private string _connectionString = "";

		public CORPlugin() : base(
			new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4"),
			"FeatherTracker COR",
			new List<Guid>()
			{
			})
		{
		}

		public override void ConfigureConfiguration(IConfiguration configuration)
		{
			_connectionString = configuration.GetSectionValue<string>("COR", "DatabaseConnectionString");

			base.ConfigureConfiguration(configuration);
		}

		public override void ConfigureServices(IServiceCollection services)
		{
			services.AddSwaggerGen(c =>
			{
				var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
				c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
			});

			services.AddSingleton<IDBClient>(new DBClient(_connectionString));

			base.ConfigureServices(services);
		}
	}
}
