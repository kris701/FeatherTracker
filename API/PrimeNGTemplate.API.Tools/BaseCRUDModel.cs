using DatabaseSharp;
using PrimeNGTemplate.API.Tools.Serialization;

namespace PrimeNGTemplate.API.Tools
{
	public abstract class BaseCRUDModel<TAdd, TModel, TGetAll, TListModel>(IDBClient client, string addSTP, string updateSTP, string getModel, string getAllModel, string deleteModel)
		where TAdd : notnull, new()
		where TModel : class, new()
		where TGetAll : class, new()
		where TListModel : class, new()
	{
		public BaseSerializableSingleDBModel<TAdd, TModel> addModel = new BaseSerializableSingleDBModel<TAdd, TModel>(client, addSTP);
		public BaseSerializableSingleDBModel<TModel, TModel> updateModel = new BaseSerializableSingleDBModel<TModel, TModel>(client, updateSTP);
		public BaseSerializableSingleDBModel<GetModel, TModel> getModel = new BaseSerializableSingleDBModel<GetModel, TModel>(client, getModel);
		public BaseSerializableListDBModel<TGetAll, TListModel> getAllModel = new BaseSerializableListDBModel<TGetAll, TListModel>(client, getAllModel);
		public BaseSerializableSingleDBModel<DeleteModel, TModel> deleteModel = new BaseSerializableSingleDBModel<DeleteModel, TModel>(client, deleteModel);
	}
}
