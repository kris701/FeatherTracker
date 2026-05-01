using DatabaseSharp;
using DatabaseSharp.Tools;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.WGT.Models.Shared.Weights;

namespace FeatherTracker.Plugins.WGT.DatabaseInterfaces.BirdWeights
{
	public class BirdWeightsInterface(IDBClient client) : BaseCRUDSerializerModel<AddWeightInput, GetAllBirdWeightsInput, WeightModel, WeightModel, GetModel, DeleteRangeModel, EmptyModel>(
		client,
		"WGT.AddWeight",
		"WGT.UpdateWeight",
		"",
		"WGT.GetAllWeights",
		"WGT.DeleteWeight")
	{
	}
}
