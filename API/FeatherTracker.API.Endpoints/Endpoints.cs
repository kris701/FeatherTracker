// This document is auto generated!
public static class Endpoints {
	public const string Name = "endpoints";
	public static class Core {
		public const string Name = "endpoints/core";
		public static class Authentication {
			public const string Name = "endpoints/core/authentication";
			public const string Post_Authenticate = "endpoints/core/authentication";
			public const string Post_Impersonate = "endpoints/core/authentication/impersonate";
		}
		public static class Permissions {
			public const string Name = "endpoints/core/permissions";
			public const string Get_AllPermissions = "endpoints/core/permissions";
		}
		public static class Users {
			public const string Name = "endpoints/core/users";
			public const string Post_AddUser = "endpoints/core/users";
			public const string Post_VerifyUser = "endpoints/core/users/verify";
			public const string Post_SignupUser = "endpoints/core/users/signup";
			public const string Get_IsUsernameTaken = "endpoints/core/users/isusernametaken";
			public const string Patch_UpdateUser = "endpoints/core/users";
			public const string Patch_UpdatePassword = "endpoints/core/users/updatepassword";
			public const string Get_AllUsers = "endpoints/core/users/all";
			public const string Get_User = "endpoints/core/users";
			public const string Delete_User = "endpoints/core/users";
		}
	}
	public static class Birds {
		public const string Name = "endpoints/birds";
		public const string Post_AddBird = "endpoints/birds";
		public const string Patch_UpdateBird = "endpoints/birds";
		public const string Get_AllBirds = "endpoints/birds/all";
		public const string Get_Bird = "endpoints/birds";
		public const string Delete_Bird = "endpoints/birds";
		public static class Weights {
			public const string Name = "endpoints/birds/weights";
			public const string Post_AddBirdWeight = "endpoints/birds/weights";
			public const string Patch_UpdateBirdWeight = "endpoints/birds/weights";
			public const string Get_AllBirdWeights = "endpoints/birds/weights/all";
			public const string Get_GetDateRanges = "endpoints/birds/weights/ranges";
			public const string Get_BirdWeight = "endpoints/birds/weights";
			public const string Delete_BirdWeight = "endpoints/birds/weights";
			public const string Patch_PurgeBirdWeights = "endpoints/birds/weights/purge";
			public const string Post_ImportWeights = "endpoints/birds/weights/import";
		}
	}
	public static class BugReports {
		public const string Name = "endpoints/bugreports";
		public const string Post_AddReport = "endpoints/bugreports";
		public const string Patch_UpdateReport = "endpoints/bugreports";
		public const string Get_AllReports = "endpoints/bugreports/all";
		public const string Get_Report = "endpoints/bugreports";
		public const string Delete_Report = "endpoints/bugreports";
	}
}
