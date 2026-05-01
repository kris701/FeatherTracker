using DatabaseSharp.Attributes;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.WGT.Models.Shared.Weights
{
	public class GetDateRangesOutput
	{
		[Required]
		public DateTime Oldest { get; set; }
		[Required]
		[DatabaseSharp(FillTable = 1)]
		public DateTime Newest { get; set; }
	}
}
