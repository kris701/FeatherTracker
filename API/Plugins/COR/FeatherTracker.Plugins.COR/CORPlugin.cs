using DatabaseSharp;
using FeatherTracker.Plugins.COR.Models.Internal;
using FeatherTracker.Plugins.COR.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using Uni.API.Helpers;
using Uni.API.Models;

namespace FeatherTracker.Plugins.COR
{
	public class CORPlugin : BaseUniAPIPlugin
	{
		private string _connectionString = "";
		private string _jwtSecret = "";
		private int _jwtLifetime = -1;

		public CORPlugin() : base(
			new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4"),
			"FeatherTracker Core",
			new List<Guid>()
			{
			})
		{
		}

		public override void ConfigureConfiguration(IConfiguration configuration)
		{
			_connectionString = configuration.GetSectionValue<string>("COR", "DatabaseConnectionString");
			_jwtSecret = configuration.GetSectionValue<string>("COR", "JWTSecret");
			_jwtLifetime = configuration.GetSectionValue<int>("COR", "JWTLifetime");

			base.ConfigureConfiguration(configuration);
		}

		public override void ConfigureServices(IServiceCollection services)
		{
			var key = Encoding.ASCII.GetBytes(_jwtSecret);
			services.AddAuthentication(options =>
			{
				options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			}).AddJwtBearer(x =>
			{
				x.RequireHttpsMetadata = false;
				x.SaveToken = true;
				x.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(key),
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true
				};
			});
			services.AddSwaggerGen(c =>
			{
				var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
				c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
			});

			services.AddSingleton<JWTSettings>(new JWTSettings(_jwtSecret, _jwtLifetime));
			services.AddSingleton<UserService>();
			services.AddSingleton<IDBClient>(new DBClient(_connectionString));

			base.ConfigureServices(services);
		}
	}
}
