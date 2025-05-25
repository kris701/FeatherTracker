using System.Security.Claims;

namespace FeatherTracker.API.Tools.Helpers
{
	public static class PermissionsHelpers
	{
		public static Guid GetExecID(this ClaimsPrincipal user) => new Guid(user.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
		public static bool HasPermission(this ClaimsPrincipal user, string target) => user.Claims.Any(x => x.Value == target);
		public static void SetExecID(this ClaimsPrincipal user, BaseExecIDModel model) => model.ExecID = user.GetExecID();
	}
}
