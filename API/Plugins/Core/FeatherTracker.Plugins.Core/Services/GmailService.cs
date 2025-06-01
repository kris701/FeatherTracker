using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace FeatherTracker.Plugins.Core.Services
{
	public class GmailService
	{
		public string SenderEmail { get; set; }
		public string SenderPassword { get; set; }
		public string SMTPAddress { get; set; }
		public int SMTPPort { get; set; }

		public GmailService(string senderEmail, string senderPassword, string sMTPAddress, int sMTPPort)
		{
			SenderEmail = senderEmail;
			SenderPassword = senderPassword;
			SMTPAddress = sMTPAddress;
			SMTPPort = sMTPPort;
		}

		public async Task SendEmailAsync(string email, string title, string body)
		{
			using (MailMessage mail = new MailMessage())
			{
				mail.From = new MailAddress("noreply@gmail.com", "noreply");
				mail.To.Add(email);
				mail.Subject = title;
				mail.ReplyToList.Add(new MailAddress("noreply@gmail.com", "noreply"));
				mail.Body = body;
				mail.IsBodyHtml = true;
				using (SmtpClient smtp = new SmtpClient(SMTPAddress, SMTPPort))
				{
					smtp.Credentials = new NetworkCredential(SenderEmail, SenderPassword);
					smtp.EnableSsl = true;
					await smtp.SendMailAsync(mail);
				}
			}
		}
	}
}
