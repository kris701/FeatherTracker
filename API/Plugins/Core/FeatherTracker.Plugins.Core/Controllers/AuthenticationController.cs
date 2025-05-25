using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Internal.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FeatherTracker.Plugins.Core.Controllers
{
	/// <summary>
	/// Controller endpoints for authentication
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class AuthenticationController : ControllerBase
	{
		private static readonly string _authFile = "auth.json";

		private readonly JWTSettings _settings;

		public AuthenticationController(JWTSettings settings)
		{
			_settings = settings;
		}

		/// <summary>
		/// Authenticate using a username and password
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If login was successful.</response>
		[AllowAnonymous]
		[HttpPost(Endpoints.Core.Authentication.Post_Authenticate)]
		public IActionResult Post_Authenticate([FromBody] AuthenticateInput inputModel)
		{
			if (!System.IO.File.Exists(_authFile))
				return BadRequest("System have not be setup yet!");
			var user = JsonSerializer.Deserialize<UserModel>(System.IO.File.ReadAllText(_authFile));
			if (user == null)
				throw new Exception("Error during deserialization!");

			inputModel.Password = HashingHelpers.CreateMD5(inputModel.Password);
			if (user.LoginName != inputModel.Username || user.Password != inputModel.Password)
				return Unauthorized("Username or password is incorrect!");

			user.Password = null;

			return Ok(new AuthenticateOutput(user, JWTTokenHelpers.CreateToken(user, _settings.Secret, _settings.LifetimeMin)));
		}

		/// <summary>
		/// Check if the system is set up
		/// </summary>
		/// <returns></returns>
		/// <response code="200"></response>
		[AllowAnonymous]
		[HttpGet(Endpoints.Core.Authentication.Get_IsSetup)]
		public IActionResult Get_IsSetup()
		{
			return Ok(System.IO.File.Exists(_authFile));
		}

		/// <summary>
		/// Perform the first setup
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If login was successful.</response>
		[AllowAnonymous]
		[HttpPost(Endpoints.Core.Authentication.Post_Setup)]
		public IActionResult Post_Setup([FromBody] UserModel inputModel)
		{
			if (System.IO.File.Exists(_authFile))
				return BadRequest("System have already been setup!");
			if (inputModel.Password == null)
				return BadRequest("No password given!");
			inputModel.Password = HashingHelpers.CreateMD5(inputModel.Password);
			System.IO.File.WriteAllText(_authFile, JsonSerializer.Serialize(inputModel));
			inputModel.Password = null;
			return Ok(new AuthenticateOutput(inputModel, JWTTokenHelpers.CreateToken(inputModel, _settings.Secret, _settings.LifetimeMin)));
		}
	}
}
