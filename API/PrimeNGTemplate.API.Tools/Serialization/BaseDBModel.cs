using DatabaseSharp;

namespace PrimeNGTemplate.API.Tools.Serialization
{
	public abstract class BaseDBModel<TIn, TOut>(IDBClient client) : IModel<TIn, TOut>
	{
		public IDBClient _client = client;

		public abstract Task<TOut> ExecuteAsync(TIn input);
	}
}
