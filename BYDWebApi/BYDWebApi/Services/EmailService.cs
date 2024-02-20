using BYDWebApi.DTO.User;
using BYDWebApi.DTO.BYDCoin;
using System;
using System.Net;
using System.Net.Mail;
using BYDWebApi.DTO.Payment;
using Stripe;
using System.Drawing;
using System.Security.Cryptography;

namespace BYDWebApi.Services
{
    public class EmailService
    {
        private string smtpAccount = "info@byddauctions.com";
        private SmtpClient smtpClient;
        public EmailService() {
            //string senderEmail = "caiter999@hotmail.com";
            //string senderPassword = "Yanyan7258@";
            //smtpClient = new SmtpClient("smtp-mail.outlook.com", 587);
            //smtpClient.EnableSsl = true;

            string senderEmail = smtpAccount;
            string senderPassword = "obone2003";
            smtpClient = new SmtpClient("smtpout.secureserver.net", 587);
            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(senderEmail, senderPassword);
        }

        public bool SendUserMakeOffer(SellerCoinOffer coinOffer)
        {
            try
            {        
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(coinOffer.SellerEmail);

                // Set the email subject and body
                mailMessage.Subject = "You receive an offer";
                mailMessage.Body = "Hi, ";
                mailMessage.IsBodyHtml = true;

                mailMessage.Body += "  You received an offer for coin - " + coinOffer.CoinName + " from " + coinOffer.UserName + "<br>";

                mailMessage.Body += "  Please review offer and give a feedback. <br>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendUserRetractOffer(SellerCoinOffer coinOffer)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(coinOffer.SellerEmail);

                // Set the email subject and body
                mailMessage.Subject = "Your offer was restracted by buyer";
                mailMessage.Body = "Hi, ";
                mailMessage.IsBodyHtml = true;

                mailMessage.Body += "  Sorry, your offer for coin - " + coinOffer.CoinName + " from " + coinOffer.UserName + " was restracted by user.<br>";

                mailMessage.Body += "  You do not need do anything.<br>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public int SendUserResetPasswordEmail(string userEmail, string webapiUrl)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(userEmail);

                // Set the email subject and body
                mailMessage.Subject = "Reset password";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi,<br>";
                mailMessage.Body += "  Please click link below to reset your password:<br>";

                mailMessage.Body += "<html><body>";
                mailMessage.Body += "<p><a href='"+webapiUrl+"'>Click here</a></p>";
                mailMessage.Body += "</body></html>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return 1;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public bool SendUserOfferAccepted(string coinName, string userEmail)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(userEmail);

                // Set the email subject and body
                mailMessage.Subject = "Your coin offer was accepted.";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi,\n";
                mailMessage.Body += "  Cong. Your coin("+ coinName + ") offer was accepted by seller.\n";

                mailMessage.Body += "Please go to [My Order] page to checkout.";

                mailMessage.Body += "\n\n\nThanks,\n";
                mailMessage.Body += "BYDD Inc.\n";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendUserOfferRejected(string coinName, string userEmail)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(userEmail);

                // Set the email subject and body
                mailMessage.Subject = "Your coin offer was rejected.";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi,<br>";
                mailMessage.Body += "  Sorry. Your coin(" + coinName + ") offer was rejected by seller.\n";

                mailMessage.Body += "\n\n\nThanks,\n";
                mailMessage.Body += "BYDD Inc.\n";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendUserInvoice(int invoiceId, User customer, List<CoinShipping> coins)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(customer.Email);

                // Set the email subject and body
                mailMessage.Subject = "Invoice - "+ invoiceId;
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi " + customer.FirstName + " " + customer.LastName + ",\n";
                mailMessage.Body += "  We received your payment for invoice - "+ invoiceId + ". Thank you very much.\n";
                mailMessage.Body += "  We will prepare shipment and send tracking number to you soon.";

                mailMessage.Body += "\n\n\nThanks,\n";
                mailMessage.Body += "BYDD Inc.\n";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendUserPaidInfoToCompany(User customer, List<CoinShipping> coins)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(customer.Email);

                // Set the email subject and body
                mailMessage.Subject = "Coin was sold";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi " + coins[0].CompanyName + ",\n";
                mailMessage.Body += "  The customer had paid your coins, like below:\n";

                foreach(CoinShipping cs in coins)
                {
                    mailMessage.Body += "   Coin Id: " + cs.CoinId + " - " + cs.Name + "\n";
                }

                mailMessage.Body += "  Please prepare shipment and update tracking number.";

                mailMessage.Body += "\n\n\nThanks,\n";
                mailMessage.Body += "BYDD Inc.\n";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendCoinSoldInfoToSeller(Coin coid)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(coid.SellerEmail);

                // Set the email subject and body
                mailMessage.Subject = "Coin was sold";
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi " + coid.SellerName + ",<br>";
                mailMessage.Body += "  Your coin - " + coid.Name + " was sold.<br>";

                mailMessage.Body += "  ASAP the buyer pay his order, you will receive another email.<br>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendMessageToSeller(MessageToSeller messageToSeller)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(messageToSeller.SellerEmail);

                // Set the email subject and body
                mailMessage.Subject = "You receive a meesage from customer about coin - " + messageToSeller.CoinName;
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi " + messageToSeller.SellerDisplayName + ",<br>";
                mailMessage.Body += "  Your receive a message about coin - "+ messageToSeller.CoinName + ": <br>";

                mailMessage.Body += "     " + messageToSeller.Message + "<br>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendCoinNotify(CoinNotifyMessage coinNotifyMessage)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add(coinNotifyMessage.UserEmail);

                // Set the email subject and body
                mailMessage.Subject = "Coin Notify : coin - " + coinNotifyMessage.CoinName + " price was down to " + coinNotifyMessage.CurrentPrice.ToString();
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi " + coinNotifyMessage.UserDisplayName + ",<br>";

                mailMessage.Body += "  coin - " + coinNotifyMessage.CoinName + " price was down to " + coinNotifyMessage.CurrentPrice.ToString() + "<br>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool submitContactMessage(ContactMessage contactMessage)
        {
            try
            {
                // Create a new MailMessage
                MailMessage mailMessage = new MailMessage();

                // Set the sender and recipient addresses
                mailMessage.From = new MailAddress("info@byddauctions.com");
                mailMessage.To.Add("info@byddauctions.com");

                // Set the email subject and body
                mailMessage.Subject = "Contact Message from - " + contactMessage.ContactEmail;
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = "Hi,<br>";

                mailMessage.Body += "  User: " + contactMessage.ContactEmail + "<br>";
                mailMessage.Body += "  Content: " + contactMessage.ContactContent + "<br>";

                mailMessage.Body += "<br><br><br>Thanks,<br>";
                mailMessage.Body += "BYDD Inc.<br>";

                // Send the email
                smtpClient.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
