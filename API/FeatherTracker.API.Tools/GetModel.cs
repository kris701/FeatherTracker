using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.API.Tools
{
	public class GetModel
	{
		[Required]
		public Guid ID { get; set; }

		public GetModel()
		{
			ID = Guid.Empty;
		}

		public GetModel(Guid iD)
		{
			ID = iD;
		}
	}
}
