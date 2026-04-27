using DatabaseSharp;
using DatabaseSharp.Tools;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.COR.Models.Shared.Birds;

namespace FeatherTracker.Plugins.COR.DatabaseInterface
{
	public class BirdsInterface(IDBClient client) : BaseCRUDSerializerModel<AddBirdInput, EmptyModel, BirdModel, ListBirdModel, GetModel, DeleteModel, EmptyModel>(
		client,
		"COR.AddBird",
		"COR.UpdateBird",
		"COR.GetBird",
		"COR.GetAllBirds",
		"COR.DeleteBird")
	{
	}
}
