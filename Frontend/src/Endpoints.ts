// This document is auto generated!
export const Endpoints = {
	Name: "Endpoints",
	COR: {
		Name: "COR",
		Setup: {
			Name: "Setup",
			Post_Setup: "endpoints/cor/setup",
			Get_IsSetup: "endpoints/cor/setup",
		},
		Auth: {
			Name: "Auth",
			Post_LogIn: "endpoints/cor/auth",
		},
		Birds: {
			Name: "Birds",
			Post_AddBird: "endpoints/cor/birds",
			Patch_UpdateBird: "endpoints/cor/birds",
			Get_AllBirds: "endpoints/cor/birds/all",
			Get_Bird: "endpoints/cor/birds",
			Delete_Bird: "endpoints/cor/birds",
		},
	},
	WGT: {
		Name: "WGT",
		Post_AddWeight: "endpoints/wgt",
		Patch_UpdateWeight: "endpoints/wgt",
		Get_AllWeights: "endpoints/wgt/all",
		Get_GetDateRanges: "endpoints/wgt/ranges",
		Patch_DeleteWeights: "endpoints/wgt/delete",
		Post_ImportWeights: "endpoints/wgt/import",
	},
	FOD: {
		Name: "FOD",
		Post_AddRecipie: "endpoints/fod",
		Patch_UpdateRecipie: "endpoints/fod",
		Get_AllRecipies: "endpoints/fod/all",
		Get_Recipie: "endpoints/fod",
		Delete_Recipie: "endpoints/fod",
	},
}
