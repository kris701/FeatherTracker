using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using Uni.API.Models;

namespace FeatherTracker.Plugins.Core
{
	public class CorePlugin : BaseUniAPIPlugin
	{
		private string _jwtSecret = "";
		private int _jwtLifetime = -1;

		public CorePlugin() : base(
			new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4"),
			"FeatherTracker Core",
			new List<Guid>()
			{
			})
		{
		}

		public override void ConfigureConfiguration(IConfiguration configuration)
		{
			_jwtSecret = GetSectionValue(configuration, "JWTSecret");
			_jwtLifetime = int.Parse(GetSectionValue(configuration, "JWTLifetime"));

			base.ConfigureConfiguration(configuration);
		}

		public override void ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton(new JWTSettings(_jwtSecret, _jwtLifetime));
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

			base.ConfigureServices(services);
		}

		private string GetSectionValue(IConfiguration configuration, string key)
		{
			var str = configuration.GetSection("Core")[key];
			if (str == null)
				throw new Exception($"'{key}' for plugin was not set in IConfiguration!");
			return str;
		}
	}
}
