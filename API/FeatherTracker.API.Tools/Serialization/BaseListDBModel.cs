using DatabaseSharp;

namespace FeatherTracker.API.Tools.Serialization
{
	public abstract class BaseListDBModel<TIn, TOut>(IDBClient client) : IListModel<TIn, TOut>
	{
		internal IDBClient _client = client;

		public abstract Task<List<TOut>> ExecuteAsync(TIn input);
	}
}
