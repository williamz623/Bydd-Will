using Dapper;
using System.Data.SqlClient;
using System.Data;
using BCrypt.Net;
using BYDWebApi.DTO.User;
using BYDWebApi.DTO.BYDCoin;

namespace BYDWebApi.Services
{
    public class UserService
    {
        public string _ConnectString;
        public UserService()
        {
            var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .Build();
            _ConnectString = configuration.GetConnectionString("HangfireConnection");

            //_ConnectString = "Server=WINSVR2022-BYD; Initial Catalog=BYD;User ID=intranetuser;Password=devel0per;Connect Timeout=90";
        }

        public string AddNewUser(DTO.User.User newUser)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@Email", newUser.Email);
                param.Add("@FirstName", newUser.FirstName);
                param.Add("@LastName", newUser.LastName);
                param.Add("@DisplayName", newUser.DisplayName);
                param.Add("@Password", BCrypt.Net.BCrypt.HashPassword(newUser.Password));
                param.Add("@Phone", newUser.Phone);
                param.Add("@Mobile", newUser.Mobile);
                param.Add("@Address1", newUser.Address1);
                param.Add("@Address2", newUser.Address2);
                param.Add("@City", newUser.City);
                param.Add("@Province", newUser.Province);
                param.Add("@PostalCode", newUser.PostalCode);
                param.Add("@Country", newUser.Country);
                param.Add("@CountryCode", newUser.CountryCode);

                List <Coin> coins = _db.Query<Coin>("dbo.User_Add", param, commandType: CommandType.StoredProcedure).ToList();

                return "Succeeded";
            }
        }

        public string UpdateUserProfile(DTO.User.User user)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //process password
                string password = "";
                if (string.IsNullOrEmpty(user.Password))
                    password = user.PasswordOld;
                else
                    password = BCrypt.Net.BCrypt.HashPassword(user.Password);

                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@Email", user.Email);
                param.Add("@FirstName", user.FirstName);
                param.Add("@LastName", user.LastName);
                param.Add("@DisplayName", user.DisplayName);
                param.Add("@Password", password);
                param.Add("@Phone", user.Phone);
                param.Add("@Mobile", user.Mobile);
                param.Add("@Address1", user.Address1);
                param.Add("@Address2", user.Address2);
                param.Add("@City", user.City);
                param.Add("@Province", user.Province);
                param.Add("@PostalCode", user.PostalCode);
                param.Add("@Country", user.Country);
                param.Add("@CountryCode", user.CountryCode);

                List<Coin> coins = _db.Query<Coin>("dbo.User_Update", param, commandType: CommandType.StoredProcedure).ToList();

                return "Succeeded";
            }
        }

        public int checkUserExisted(string userEmail)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //send reset password email to user
                string guidString = Guid.NewGuid().ToString();
                DynamicParameters param = new DynamicParameters();
                param.Add("@UserEmail", userEmail);
                param.Add("@IsExisted", dbType: DbType.Int32, direction: ParameterDirection.Output);

                _db.Execute("dbo.User_Email_Check", param, commandType: CommandType.StoredProcedure);
                int outputId = param.Get<int>("@IsExisted");

                return outputId;
            }
        }

        public bool VerifyPassword(string username, string passwordToCheck)
        {
            // Retrieve the stored hashed password from the database for the given username
            string storedHashedPassword = "GetStoredHashedPassword(username)";

            // Verify the provided password against the stored hashed password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(passwordToCheck, storedHashedPassword);

            return isPasswordValid;
        }

        public User GetUserProfile(string userEmail)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@UserEmail", userEmail);
                //User currentUser = _db.Query<User>("dbo.User_Profile_Get", param, commandType: CommandType.StoredProcedure).FirstOrDefault();

                var result = _db.QueryMultiple("dbo.User_Profile_Get", param, commandType: CommandType.StoredProcedure);
                UserProfile currentUser = result.Read<UserProfile>().FirstOrDefault();
                currentUser.CoinWatchList = result.Read<int>().ToList();
                currentUser.CoinOffer = result.Read<CoinOffer>().ToList();
                currentUser.CoinOrder = result.Read<CoinOrder>().ToList();

                return currentUser;
            }
        }

        public List<Country> GetCountries()
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                List<Country> countries = _db.Query<Country>("dbo.Country_List", param, commandType: CommandType.StoredProcedure).ToList();

                return countries;
            }
        }

        public List<int> AddCoinToWatchlist(WatchCoin watchCoin)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", watchCoin.CoinId);
                param.Add("@UserId", watchCoin.UserId);
                
                List<int> watchCoins = _db.Query<int>("dbo.User_WatchList_Add", param, commandType: CommandType.StoredProcedure).ToList();

                return watchCoins;
            }
        }

        public List<int> RemoveCoinFromWatchlist(WatchCoin watchCoin)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", watchCoin.CoinId);
                param.Add("@UserId", watchCoin.UserId);

                List<int> watchCoins = _db.Query<int>("dbo.User_WatchList_Remove", param, commandType: CommandType.StoredProcedure).ToList();

                return watchCoins;
            }
        }

        public CoinOffer SendOffer(CoinOffer coinOffer)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coinOffer.CoinId);
                param.Add("@UserId", coinOffer.UserId);
                param.Add("@OfferPrice", coinOffer.OfferPrice);

                SellerCoinOffer newUserOffer = _db.Query<SellerCoinOffer>("dbo.User_Coin_Offer_Add", param, commandType: CommandType.StoredProcedure).FirstOrDefault();

                //send offer email to seller
                if (newUserOffer != null)
                {
                    EmailService emailService = new EmailService();
                    if (emailService.SendUserMakeOffer(newUserOffer))
                        ChangeCoinOfferStatus(coinOffer.CoinId, coinOffer.UserId, "ST");
                }

                return newUserOffer;
            }
        }

        public CoinOffer RetractOffer(CoinOffer coinOffer)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coinOffer.CoinId);
                param.Add("@UserId", coinOffer.UserId);
                param.Add("@OfferPrice", coinOffer.OfferPrice);

                SellerCoinOffer retractUserOffer = _db.Query<SellerCoinOffer>("dbo.User_Coin_Offer_Retract", param, commandType: CommandType.StoredProcedure).FirstOrDefault();

                //send offer email to seller
                if (retractUserOffer != null)
                {
                    EmailService emailService = new EmailService();
                    emailService.SendUserRetractOffer(retractUserOffer);
                }

                return retractUserOffer;
            }
        }

        public int NotifyMe(CoinNotify coin)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coin.CoinId);
                param.Add("@UserId", coin.UserId);
                param.Add("@NotifyPrice", coin.NotifyPrice);

                _db.Execute("dbo.User_Coin_Notify_Add", param, commandType: CommandType.StoredProcedure);

                return 1;
            }
        }
        public int CancelNotify(CoinNotify coin)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coin.CoinId);
                param.Add("@UserId", coin.UserId);

                _db.Execute("dbo.User_Coin_Notify_Cancel", param, commandType: CommandType.StoredProcedure);

                return 1;
            }
        }

        public List<UserInvoice> getUserInvoices(int userId)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@UserId", userId);
                List<UserInvoice> userInvoices = _db.Query<UserInvoice>("dbo.User_Invoices_Get", param, commandType: CommandType.StoredProcedure).ToList(); ;
                return userInvoices;
            }
        }

        public List<MessageToSeller> getCoinUserMessage(int coinId, int userId)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get seller information
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coinId);
                param.Add("@UserId", userId);

                List<MessageToSeller> messages = _db.Query<MessageToSeller>("dbo.User_Message_List", param, commandType: CommandType.StoredProcedure).ToList();

                return messages;
            }
        }

        public bool setCoinUserMessageHadRead(int coinId, int userId)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get seller information
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coinId);
                param.Add("@UserId", userId);

                _db.Execute("dbo.User_Message_Set", param, commandType: CommandType.StoredProcedure);

                return true;
            }
        }

        public bool SaveMessage(MessageToSeller msgToSeller)
        {
            if (msgToSeller.MessageIndicator != "R") msgToSeller.MessageIndicator = "S";
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get seller information
                DynamicParameters param = new DynamicParameters();
                param.Add("@UserId", msgToSeller.UserId);
                param.Add("@CoinId", msgToSeller.CoinId);
                param.Add("@SellerId", msgToSeller.SellerId);
                param.Add("@Message", msgToSeller.Message);
                param.Add("@Indicator", msgToSeller.MessageIndicator);

                _db.Execute("dbo.User_Message_Add", param, commandType: CommandType.StoredProcedure);

                return true;
            }
        }

        public bool SendMessage(MessageToSeller msgToSeller)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get seller information
                DynamicParameters param = new DynamicParameters();
                param.Add("@SellerId", msgToSeller.SellerId);
                param.Add("@UserId", msgToSeller.UserId);

                MessageToSeller messageToSeller = _db.Query<MessageToSeller>("dbo.Seller_Infor_Get", param, commandType: CommandType.StoredProcedure).FirstOrDefault();

                if (messageToSeller != null)
                {
                    messageToSeller.CoinName = msgToSeller.CoinName;
                    messageToSeller.Message = msgToSeller.Message;
                    EmailService emailService = new EmailService();
                    return emailService.SendMessageToSeller(messageToSeller);
                }
                else
                    return false;
            }
        }

        public bool submitContactMessage(ContactMessage contactMessage)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get seller information
                //DynamicParameters param = new DynamicParameters();
                //param.Add("@ContactFirstName", contactMessage.ContactFirstName);
                //param.Add("@ContactLastName", contactMessage.ContactLastName);
                //param.Add("@ContactEmail", contactMessage.ContactEmail);
                //param.Add("@ContactSubject", contactMessage.ContactSubject);
                //param.Add("@ContactContent", contactMessage.ContactContent);

                //_db.Execute("dbo.User_ContactUs_Add", param, commandType: CommandType.StoredProcedure);

                //send email
                EmailService emailService = new EmailService();
                return emailService.submitContactMessage(contactMessage);

            }
        }

        public void ChangeCoinOfferStatus(int coinId, int userId, string statusCode)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@CoinId", coinId);
                param.Add("@UserId", userId);
                param.Add("@OfferStatusCode", statusCode);

                int newUserOfferId = _db.Query<int>("dbo.User_Coin_Offer_Status_Changed", param, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
        }


        public int forgetPassword(string userEmail, string webapiUrl)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //send reset password email to user
                string guidString = Guid.NewGuid().ToString();
                DynamicParameters param = new DynamicParameters();
                param.Add("@UserEmail", userEmail);
                param.Add("@GUID", guidString);
                param.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

                _db.Execute("dbo.User_Reset_Password_Add", param, commandType: CommandType.StoredProcedure);
                int outputId = param.Get<int>("@Id");

                if (outputId > 0)
                {
                    EmailService emailService = new EmailService();
                    return emailService.SendUserResetPasswordEmail(userEmail, webapiUrl+ guidString);
                }

                return 0;
            }
        }

        public int changePassword(UserNewPassword userNewPassword)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //send reset password email to user
                string guidString = Guid.NewGuid().ToString();
                DynamicParameters param = new DynamicParameters();
                param.Add("@GUID", userNewPassword.GUID);
                param.Add("@NewPassword", BCrypt.Net.BCrypt.HashPassword(userNewPassword.Password));
                param.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

                _db.Execute("dbo.User_Password_Change", param, commandType: CommandType.StoredProcedure);
                int outputId = param.Get<int>("@Id");

                return outputId;
            }
        }
    }
}
