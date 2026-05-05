using DatabaseSharp;
using DatabaseSharp.Tools;
using FeatherTracker.API.Tools;
using FeatherTracker.Plugins.FOD.Models.Shared.Recipies;

namespace FeatherTracker.Plugins.FOD.DatabaseInterfaces
{
	public class RecipiesInterface(IDBClient client) : BaseCRUDSerializerModel<AddRecipieInput, EmptyModel, RecipieModel, ListRecipieModel, GetModel, DeleteModel, EmptyModel>(
		client,
		"FOD.AddRecipie",
		"FOD.UpdateRecipie",
		"FOD.GetRecipie",
		"FOD.GetAllRecipies",
		"FOD.DeleteRecipie")
	{
	}
}
