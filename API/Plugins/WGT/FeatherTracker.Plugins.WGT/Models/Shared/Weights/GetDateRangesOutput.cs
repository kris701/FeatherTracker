using DatabaseSharp.Attributes;
using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights
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
