using DatabaseSharp;

namespace FeatherTracker.API.Tools.Serialization
{
	public class BaseSerializableListDBModel<TIn, TOut>(IDBClient client, string targetSTP) : BaseListDBModel<TIn, TOut>(client)
		where TIn : notnull, new()
		where TOut : class, new()
	{
		public string TargetSTP { get; set; } = targetSTP;

		public override async Task<List<TOut>> ExecuteAsync(TIn input)
		{
			await PreExecuteAsync(input);
			var result = await _client.ExecuteAsync(TargetSTP, input);
			if (result.Count == 0)
				return new List<TOut>();
			var models = result[0].FillAll<TOut>(result);
			await PostExecuteAsync(models);
			return models;
		}

		public virtual async Task PreExecuteAsync(TIn input)
		{

		}

		public virtual async Task PostExecuteAsync(List<TOut> output)
		{

		}
	}
}
