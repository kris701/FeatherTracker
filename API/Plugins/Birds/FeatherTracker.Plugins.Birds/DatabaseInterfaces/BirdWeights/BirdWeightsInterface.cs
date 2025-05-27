using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights;

namespace FeatherTracker.Plugins.Birds.DatabaseInterfaces.BirdWeights
{
	public class BirdWeightsInterface(IDBClient client) : BaseCRUDModel<AddBirdWeightInput, BirdWeightModel, GetAllBirdWeightsInput, BirdWeightModel>(
		client,
		"BRD.SP_AddBirdWeight",
		"BRD.SP_UpdateBirdWeight",
		"BRD.SP_GetBirdWeight",
		"BRD.SP_GetAllBirdWeights",
		"BRD.SP_DeleteBirdWeight")
	{
	}
}
