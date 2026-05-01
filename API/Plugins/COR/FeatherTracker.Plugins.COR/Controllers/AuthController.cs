using FeatherTracker.Plugins.COR.Models.Internal;
using FeatherTracker.Plugins.COR.Models.Shared.Authentication;
using FeatherTracker.Plugins.COR.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace FeatherTracker.Plugins.COR.Controllers
{
	[Authorize]
	[Produces("application/json")]
	public class AuthController : ControllerBase
	{
		private readonly UserService _userService;

		public AuthController(UserService userService)
		{
			_userService = userService;
		}

		/// <summary>
		/// Authenticate using a username and password
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If login was successful.</response>
		[AllowAnonymous]
		[HttpPost(Endpoints.COR.Auth.Post_LogIn)]
		public async Task<IActionResult> Post_LogIn([FromBody] AuthRequest inputModel)
		{
			return Ok(_userService.Authenticate(inputModel));
		}
	}
}
