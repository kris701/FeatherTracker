using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FeatherTracker.Plugins.FOD.Models.Shared.Recipies
{
	public class AddRecipieInput
	{
		[Required]
		public string Name { get; set; }
		[Required] 
		public string Recipie { get; set; }
		[Required] 
		public double Quantity { get; set; }
		[Required]
		public string Unit { get; set; }
		[Required] 
		public List<Guid> Birds { get; set; }
	}
}
