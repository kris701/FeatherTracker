using Microsoft.OpenApi.Models;
using System.Reflection;
using Uni.API;

namespace PrimeNGTemplate.API
{
	public class Startup : UniAPIStartup
	{
		public Startup(IConfiguration configuration) : base(
			configuration,
			new List<string>()
			{
				DefaultPluginNamespace,
				"PrimeNGTemplate.Plugin"
			})
		{
		}

		public override void ConfigureServices(IServiceCollection services)
		{
			services.AddSwaggerGen(c =>
			{
				var thisVersion = Assembly.GetEntryAssembly()?.GetName().Version!;
				var thisVersionStr = $"v{thisVersion.Major}.{thisVersion.Minor}.{thisVersion.Build}";

				c.SwaggerDoc("v1", new OpenApiInfo { Title = "PrimeNGTemplate API", Version = thisVersionStr });
				var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
				c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

				c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
					Name = "Authorization",
					In = ParameterLocation.Header,
					Type = SecuritySchemeType.ApiKey,
					Scheme = "Bearer"
				});
				c.AddSecurityRequirement(new OpenApiSecurityRequirement()
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							},
							Scheme = "oauth2",
							Name = "Bearer",
							In = ParameterLocation.Header,

						},
						new List<string>()
					}
				});
			});
			base.ConfigureServices(services);
		}

		public override void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
		{
			app.UseCors(o =>
			{
				o.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
			});
			app.UseSwagger();
			app.UseSwaggerUI();
			app.UseHttpsRedirection();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseEndpoints(delegate (IEndpointRouteBuilder endpoints)
			{
				endpoints.MapControllers();
			});
		}
	}
}
