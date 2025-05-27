using DatabaseSharp;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.Birds.Models.Shared.Birds;

namespace FeatherTracker.Plugins.Birds.DatabaseInterfaces.Birds
{
	public class BirdsInterface(IDBClient client) : BaseCRUDModel<AddBirdInput, BirdModel, EmptyModel, ListBirdModel>(
		client,
		"BRD.SP_AddBird",
		"BRD.SP_UpdateBird",
		"BRD.SP_GetBird",
		"BRD.SP_GetAllBirds",
		"BRD.SP_DeleteBird")
	{
	}
}
