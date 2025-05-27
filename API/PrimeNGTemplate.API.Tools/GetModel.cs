using System.ComponentModel.DataAnnotations;

namespace PrimeNGTemplate.API.Tools
{
	public class GetModel : BaseExecIDModel
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

		public GetModel(Guid iD, Guid execID)
		{
			ID = iD;
			ExecID = execID;
		}
	}
}
