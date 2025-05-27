namespace FeatherTracker.API.Tools.Serialization
{
	public interface IModel<TIn, TOut>
	{
		public Task<TOut> ExecuteAsync(TIn input);
	}
}
