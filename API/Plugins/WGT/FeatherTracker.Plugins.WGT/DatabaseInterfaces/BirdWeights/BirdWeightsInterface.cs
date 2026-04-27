using DatabaseSharp;
using DatabaseSharp.Tools;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights;

namespace FeatherTracker.Plugins.Birds.DatabaseInterfaces.BirdWeights
{
	public class BirdWeightsInterface(IDBClient client) : BaseCRUDSerializerModel<AddWeightInput, GetAllBirdWeightsInput, WeightModel, WeightModel, GetModel, DeleteModel, EmptyModel>(
		client,
		"WGT.AddWeight",
		"WGT.UpdateWeight",
		"",
		"WGT.GetAllWeights",
		"WGT.DeleteWeight")
	{
	}
}
