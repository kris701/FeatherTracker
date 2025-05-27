// This document is auto generated!
export const Endpoints = {
	Name: "Endpoints",
	Core: {
		Name: "Core",
		Authentication: {
			Name: "Authentication",
			Post_Authenticate: "endpoints/core/authentication",
			Post_Impersonate: "endpoints/core/authentication/impersonate",
		},
		Permissions: {
			Name: "Permissions",
			Get_AllPermissions: "endpoints/core/permissions",
		},
		Users: {
			Name: "Users",
			Post_AddUser: "endpoints/core/users",
			Post_SignupUser: "endpoints/core/users/signup",
			Get_IsUsernameTaken: "endpoints/core/users/isusernametaken",
			Patch_UpdateUser: "endpoints/core/users",
			Patch_UpdatePassword: "endpoints/core/users/updatepassword",
			Get_AllUsers: "endpoints/core/users/all",
			Get_User: "endpoints/core/users",
			Delete_User: "endpoints/core/users",
		},
	},
	Birds: {
		Name: "Birds",
		Post_AddBird: "endpoints/birds",
		Patch_UpdateBird: "endpoints/birds",
		Get_AllBirds: "endpoints/birds/all",
		Get_Bird: "endpoints/birds",
		Delete_Bird: "endpoints/birds",
		Weights: {
			Name: "Weights",
			Post_AddBirdWeight: "endpoints/birds/weights",
			Patch_UpdateBirdWeight: "endpoints/birds/weights",
			Get_AllBirdWeights: "endpoints/birds/weights/all",
			Get_BirdWeight: "endpoints/birds/weights",
			Delete_BirdWeight: "endpoints/birds/weights",
		},
	},
}
