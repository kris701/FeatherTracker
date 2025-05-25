namespace FeatherTracker.API.Tools
{
	public class EmptyModel : BaseExecIDModel
	{
		public EmptyModel()
		{

		}

		public EmptyModel(Guid execID)
		{
			ExecID = execID;
		}
	}
}
