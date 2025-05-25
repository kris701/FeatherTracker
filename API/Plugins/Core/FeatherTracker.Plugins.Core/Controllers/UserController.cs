using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Authentication;
using FeatherTracker.Plugins.Core.Models.Shared.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FeatherTracker.Plugins.Core.Controllers
{
	/// <summary>
	/// Controller endpoints for the user
	/// </summary>
	/// <response code="401">If Unauthroized.</response>
	[Authorize]
	[Produces("application/json")]
	public class UserController : ControllerBase
	{
		private static readonly string _authFile = "auth.json";

		/// <summary>
		/// Change your password
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <exception cref="Exception"></exception>
		/// <response code="200">If password change was successful.</response>
		[HttpPatch(Endpoints.Core.User.Patch_UpdatePassword)]
		[Authorize]
		public IActionResult Patch_UpdatePassword([FromBody] UpdatePasswordInput inputModel)
		{
			if (!System.IO.File.Exists(_authFile))
				return BadRequest("System have not be setup yet!");
			var user = JsonSerializer.Deserialize<UserModel>(System.IO.File.ReadAllText(_authFile));
			if (user == null)
				throw new Exception("Error during deserialization!");
			if (user.Password != HashingHelpers.CreateMD5(inputModel.OldPassword))
				return BadRequest("Old password does not match new password!");
			inputModel.NewPassword = HashingHelpers.CreateMD5(inputModel.NewPassword);
			user.Password = inputModel.NewPassword;
			System.IO.File.WriteAllText(_authFile, JsonSerializer.Serialize(user));
			user.Password = null;
			return Ok(user);
		}

		/// <summary>
		/// Update your user
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <exception cref="Exception"></exception>
		/// <response code="200">The updated user.</response>
		[HttpPatch(Endpoints.Core.User.Patch_UpdateUser)]
		[Authorize]
		public IActionResult Patch_UpdateUser([FromBody] UserModel inputModel)
		{
			if (!System.IO.File.Exists(_authFile))
				return BadRequest("System have not be setup yet!");
			var user = JsonSerializer.Deserialize<UserModel>(System.IO.File.ReadAllText(_authFile));
			if (user == null)
				throw new Exception("Error during deserialization!");

			user.FirstName = inputModel.FirstName;
			user.LastName = inputModel.LastName;
			user.LoginName = inputModel.LoginName;

			System.IO.File.WriteAllText(_authFile, JsonSerializer.Serialize(user));
			user.Password = null;
			return Ok(user);
		}

		/// <summary>
		/// Gets your user
		/// </summary>
		/// <returns></returns>
		/// <exception cref="Exception"></exception>
		/// <response code="200">Your user.</response>
		[HttpGet(Endpoints.Core.User.Get_GetUser)]
		[Authorize]
		public IActionResult Get_GetUser()
		{
			if (!System.IO.File.Exists(_authFile))
				return BadRequest("System have not be setup yet!");
			var user = JsonSerializer.Deserialize<UserModel>(System.IO.File.ReadAllText(_authFile));
			if (user == null)
				throw new Exception("Error during deserialization!");
			user.Password = null;
			return Ok(user);
		}
	}
}
