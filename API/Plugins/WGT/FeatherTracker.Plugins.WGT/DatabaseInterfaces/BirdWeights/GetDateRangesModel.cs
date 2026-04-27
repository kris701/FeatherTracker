using DatabaseSharp;
using DatabaseSharp.Tools;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights;

namespace FeatherTracker.Plugins.Birds.DatabaseInterfaces.BirdWeights
{
	public class GetDateRangesModel(IDBClient client) :
		BaseSingleSerializerModel<GetModel, GetDateRangesOutput, EmptyModel>(client, "WGT.GetDateRanges")
	{
	}
}
