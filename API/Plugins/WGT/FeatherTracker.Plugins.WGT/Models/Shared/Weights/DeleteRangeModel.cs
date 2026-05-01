using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FeatherTracker.Plugins.WGT.Models.Shared.Weights
{
	public class DeleteRangeModel
	{
		[Required]
		public List<Guid> IDs { get; set; }
	}
}
