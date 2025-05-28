using DatabaseSharp.Models;
using FeatherTracker.API.Tools;
using System.ComponentModel.DataAnnotations;

namespace FeatherTracker.Plugins.Birds.Models.Shared.BirdWeights
{
	public class GetDateRangesOutput : BaseExecIDModel
	{
		[Required]
		public DateTime Oldest { get; set; }
		[Required]
		[DatabaseSharp(FillTable = 1)]
		public DateTime Newest { get; set; }
	}
}
