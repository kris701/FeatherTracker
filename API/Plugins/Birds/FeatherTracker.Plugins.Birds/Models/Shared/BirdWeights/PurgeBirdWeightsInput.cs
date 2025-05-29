using FeatherTracker.API.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights
{
	public class PurgeBirdWeightsInput : BaseExecIDModel
	{
		public List<Guid> IDs { get; set; }
	}
}
