using DatabaseSharp;

namespace FeatherTracker.API.Tools.Serialization
{
	public class BaseSerializableSingleDBModel<TIn, TOut>(IDBClient client, string targetSTP) : BaseDBModel<TIn, TOut>(client)
		where TIn : notnull, new()
		where TOut : class, new()
	{
		public string TargetSTP { get; set; } = targetSTP;

		public override async Task<TOut> ExecuteAsync(TIn input)
		{
			await PreExecuteAsync(input);
			var result = await _client.ExecuteAsync(TargetSTP, input);
			if (result.Count == 0)
				return new();
			if (result[0].Count == 0)
				return new();
			var model = result[0][0].Fill<TOut>(result);
			await PostExecuteAsync(model);
			return model;
		}

		public virtual async Task PreExecuteAsync(TIn input)
		{

		}

		public virtual async Task PostExecuteAsync(TOut output)
		{

		}
	}
}
