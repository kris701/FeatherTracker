using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.API.Tools
{
	public class DeleteModel
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
	}
}
