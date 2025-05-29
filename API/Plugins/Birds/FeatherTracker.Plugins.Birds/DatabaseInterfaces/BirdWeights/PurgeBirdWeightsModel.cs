using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.API.Tools.Serialization;
using FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights;
using FeatherTracker.Plugins.Core.Helpers;
using FeatherTracker.Plugins.Core.Models.Shared.Users;

namespace FeatherTracker.Plugins.Birds.DatabaseInterfaces.BirdWeights
{
	public class PurgeBirdWeightsModel(IDBClient client) :
		BaseSerializableSingleDBModel<PurgeBirdWeightsInput, EmptyModel>(client, "BRD.SP_PurgeBirdWeights")
	{
	}
}
