﻿using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Core.DatabaseInterface.Authentication
{
	public class IsUsernameTakenModel(IDBClient client) :
		BaseSerializableSingleDBModel<IsUsernameTakenInput, IsTakenOutput>(client, "COR.SP_IsUsernameTaken")
	{
	}
}
