// This document is auto generated!
public static class Endpoints {
	public const string Name = "endpoints";
	public static class Core {
		public const string Name = "endpoints/core";
		public static class Authentication {
			public const string Name = "endpoints/core/authentication";
			public const string Post_Authenticate = "endpoints/core/authentication";
			public const string Post_UpdatePassword = "endpoints/core/authentication/updatepassword";
			public const string Post_Impersonate = "endpoints/core/authentication/impersonate";
			public const string Get_AllPermissions = "endpoints/core/authentication/permissions";
			public const string Post_RegisterUser = "endpoints/core/authentication/register";
		}
		public static class Users {
			public const string Name = "endpoints/core/users";
			public const string Post_AddUser = "endpoints/core/users";
			public const string Patch_UpdateUser = "endpoints/core/users";
			public const string Get_AllUsers = "endpoints/core/users/users";
			public const string Get_User = "endpoints/core/users";
			public const string Delete_User = "endpoints/core/users";
		}
	}
}
