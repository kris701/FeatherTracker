using DatabaseSharp;
using DatabaseSharp.Tools;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.WGT.Models.Shared.Weights;

namespace FeatherTracker.Plugins.WGT.DatabaseInterfaces.BirdWeights
{
	public class GetDateRangesModel(IDBClient client) :
		BaseSingleSerializerModel<GetModel, GetDateRangesOutput, EmptyModel>(client, "WGT.GetDateRanges")
	{
	}
}
