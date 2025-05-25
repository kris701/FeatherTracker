// This document is auto generated!
public static class Endpoints {
	public const string Name = "endpoints";
	public static class Core {
		public const string Name = "endpoints/core";
		public static class Authentication {
			public const string Name = "endpoints/core/authentication";
			public const string Post_Authenticate = "endpoints/core/authentication";
			public const string Get_IsSetup = "endpoints/core/authentication";
			public const string Post_Setup = "endpoints/core/authentication/setup";
		}
		public static class User {
			public const string Name = "endpoints/core/user";
			public const string Get_GetUser = "endpoints/core/user";
			public const string Patch_UpdateUser = "endpoints/core/user";
			public const string Patch_UpdatePassword = "endpoints/core/user/password";
		}
	}
}
