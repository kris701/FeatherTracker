using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace FeatherTracker.API.Filters
{
	public class AuthorizeCheckOperationFilter : IOperationFilter
	{
		public void Apply(OpenApiOperation operation, OperationFilterContext context)
		{
			if (context.MethodInfo.DeclaringType is null)
				return;

			var hasAuthorize = context.MethodInfo.DeclaringType.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
						|| context.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any();

			if (hasAuthorize)
			{
				var requiredScopes = context.MethodInfo
					.GetCustomAttributes(true)
					.OfType<AuthorizeAttribute>()
					.Select(attribute => attribute.Policy!)
					.Distinct()
					.ToList();

				operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthorized" });
				// operation.Responses.Add("403", new OpenApiResponse { Description = "Forbidden" });

				var jwtBearerScheme = new OpenApiSecuritySchemeReference("Bearer", context.Document);

				operation.Security =
				[
					new OpenApiSecurityRequirement
					{
						[jwtBearerScheme] = requiredScopes
					}
				];
			}
		}
	}
}
