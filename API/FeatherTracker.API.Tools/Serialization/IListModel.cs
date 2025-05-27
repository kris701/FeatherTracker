namespace FeatherTracker.API.Tools.Serialization
{
	public interface IListModel<TIn, TOut>
	{
		public Task<List<TOut>> ExecuteAsync(TIn input);
	}
}
