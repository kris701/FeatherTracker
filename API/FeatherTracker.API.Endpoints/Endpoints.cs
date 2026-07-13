// This document is auto generated!
public static class Endpoints
{
	public const string Name = "endpoints";
	public static class COR
	{
		public const string Name = "endpoints/cor";
		public static class Setup
		{
			public const string Name = "endpoints/cor/setup";
			public const string Post_Setup = "endpoints/cor/setup";
			public const string Get_IsSetup = "endpoints/cor/setup";
		}
		public static class Auth
		{
			public const string Name = "endpoints/cor/auth";
			public const string Post_LogIn = "endpoints/cor/auth";
		}
		public static class Birds
		{
			public const string Name = "endpoints/cor/birds";
			public const string Post_AddBird = "endpoints/cor/birds";
			public const string Patch_UpdateBird = "endpoints/cor/birds";
			public const string Get_AllBirds = "endpoints/cor/birds/all";
			public const string Get_Bird = "endpoints/cor/birds";
			public const string Delete_Bird = "endpoints/cor/birds";
		}
	}
	public static class WGT
	{
		public const string Name = "endpoints/wgt";
		public const string Post_AddWeight = "endpoints/wgt";
		public const string Patch_UpdateWeight = "endpoints/wgt";
		public const string Get_AllWeights = "endpoints/wgt/all";
		public const string Get_GetDateRanges = "endpoints/wgt/ranges";
		public const string Patch_DeleteWeights = "endpoints/wgt/delete";
		public const string Post_ImportWeights = "endpoints/wgt/import";
	}
	public static class FOD
	{
		public const string Name = "endpoints/fod";
		public const string Post_AddRecipie = "endpoints/fod";
		public const string Patch_UpdateRecipie = "endpoints/fod";
		public const string Get_AllRecipies = "endpoints/fod/all";
		public const string Get_Recipie = "endpoints/fod";
		public const string Delete_Recipie = "endpoints/fod";
	}
}
