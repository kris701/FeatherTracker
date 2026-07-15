using DatabaseSharp;
using FeatherTracker.Plugins.COR.Models.Internal;
using FeatherTracker.Plugins.COR.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Reflection;
using Uni.API.Helpers;
using Uni.API.Models;

namespace FeatherTracker.Plugins.COR
{
	public class CORPlugin : BaseUniAPIPlugin
	{
		private string _connectionString = "";
		private int _jwtLifetime = -1;
		private string _apiURL = "";

		private readonly JWTSigningKeyService _signingKeyService = new JWTSigningKeyService();

		public CORPlugin() : base(
			new Guid("1ae27478-9875-4a9e-8df0-ac0cc2448bd4"),
			"FeatherTracker Core",
			new List<Guid>()
			{
			})
		{
		}

		public override void ConfigureConfiguration(IConfiguration configuration, ILogger logger)
		{
			_connectionString = configuration.GetSectionValue<string>("COR", "DatabaseConnectionString");
			_apiURL = configuration.GetSectionValue<string>("COR", "APIURL");
			_jwtLifetime = configuration.GetSectionValue<int>("COR", "JWTLifetime");

			base.ConfigureConfiguration(configuration, logger);
		}

		public override void ConfigureServices(IServiceCollection services, ILogger logger)
		{
			services.AddSingleton<JWTSigningKeyService>(_signingKeyService);
			services.AddAuthentication(options =>
			{
				options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			}).AddJwtBearer(x =>
			{
				x.SaveToken = true;
#if DEBUG
				x.RequireHttpsMetadata = false;
#endif
				x.Audience = _apiURL;
				x.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKeyResolver = _signingKeyService.GetKeys,
					ValidIssuer = _apiURL,
					ValidateIssuer = true,
					ValidAudience = _apiURL,
					ValidateAudience = true,
					ValidateLifetime = true
				};
				x.Events = new JwtBearerEvents
				{
					OnMessageReceived = (context) =>
					{
						StringValues values;

						if (!context.Request.Query.TryGetValue("access_token", out values))
						{
							return Task.CompletedTask;
						}

						if (values.Count > 1)
						{
							context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
							context.Fail(
								"Only one 'access_token' query string parameter can be defined. " +
								$"However, {values.Count:N0} were included in the request."
							);

							return Task.CompletedTask;
						}

						var token = values.Single();

						if (String.IsNullOrWhiteSpace(token))
						{
							context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
							context.Fail(
								"The 'access_token' query string parameter was defined, " +
								"but a value to represent the token was not included."
							);

							return Task.CompletedTask;
						}

						context.Token = token;

						return Task.CompletedTask;
					}
				};
			});
			services.AddSwaggerGen(c =>
			{
				var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
				c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
			});

			services.AddSingleton<JWTSettings>(new JWTSettings(_jwtLifetime, _apiURL));
			services.AddSingleton<UserService>();
			services.AddSingleton<IDBClient>(new DBClient(_connectionString));

			base.ConfigureServices(services, logger);
		}
	}
}
