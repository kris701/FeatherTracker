using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.API.Tools
{
	public class DeleteModel : BaseExecIDModel
	{
		[Required]
		public Guid ID { get; set; }

		public DeleteModel()
		{
			ID = Guid.Empty;
		}

		public DeleteModel(Guid iD)
		{
			ID = iD;
		}

		public DeleteModel(Guid iD, Guid execID)
		{
			ID = iD;
			ExecID = execID;
		}
	}
}
