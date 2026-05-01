using FeatherTracker.Plugins.COR.Models.Internal;
using FeatherTracker.Plugins.COR.Models.Shared.Authentication;
using FeatherTracker.Plugins.COR.Models.Shared.Setup;
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
	public class SetupController : ControllerBase
	{
		private readonly UserService _userService;

		public SetupController(UserService userService)
		{
			_userService = userService;
		}

		/// <summary>
		/// Perform the initial setup of the system
		/// </summary>
		/// <param name="inputModel"></param>
		/// <returns></returns>
		/// <response code="200">If setup was successful.</response>
		[AllowAnonymous]
		[HttpPost(Endpoints.COR.Setup.Post_Setup)]
		public async Task<IActionResult> Post_Setup([FromBody] SetupInput inputModel)
		{
			return Ok(_userService.CreateAdminUser(inputModel.User));
		}

		/// <summary>
		/// Check if the system is setup
		/// </summary>
		/// <returns></returns>
		/// <response code="200">If the system already is setup.</response>
		[AllowAnonymous]
		[HttpGet(Endpoints.COR.Setup.Get_IsSetup)]
		public async Task<IActionResult> Get_IsSetup()
		{
			return Ok(_userService.UserExists());
		}
	}
}
