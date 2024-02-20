using Dapper;
using System.ComponentModel.Design;
using System.Data.SqlClient;
using System.Data;
using BYDWebApi.DTO.BYDCoin;
using BYDWebApi.DTO.User;

namespace BYDWebApi.Services
{
    public class HangfireJob
    {
        public string _ConnectString;
        public string _WebApiUrl;

        public HangfireJob()
        {
            var configuration = new ConfigurationBuilder().SetBasePath(AppContext.BaseDirectory).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true).Build();
            _ConnectString = configuration.GetConnectionString("HangfireConnection");
            _WebApiUrl = configuration.GetValue<string>("WebApiUrl");
        }

        public async Task<string> YourMethodToRunDaily()
        {

            await SendMessageAsync("Refresh Coin Price at " + DateTime.Now.ToString());
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //check each coin status
                DynamicParameters param = new DynamicParameters();
                var result = _db.QueryMultiple("dbo.Job_Coin_Update", param, commandType: CommandType.StoredProcedure);
                List<Coin> coins = result.Read<Coin>().ToList();
                foreach (Coin coin in coins)
                {
                    string coinInfo = "{'CoinId':'" + coin.CoinId.ToString() + "','CurrentPrice':'" + coin.CurrentPrice + "'}";
                    await SendMessageAsync(coinInfo);
                }

                //check coin notify 
                List<CoinNotifyMessage> coinNotifies = _db.Query<CoinNotifyMessage>("dbo.User_Notify_List", param, commandType: CommandType.StoredProcedure).ToList();
                foreach (CoinNotifyMessage coinNotify in coinNotifies)
                {
                    EmailService emailService = new EmailService();
                    emailService.SendCoinNotify(coinNotify);
                }

                return "";
            }
        }

        public async Task<string> SendMessageAsync(string message)
        {
            using (HttpClient client = new HttpClient())
            {
                string apiUrl = _WebApiUrl + "/api/Scheduler/SendMessage?message=" + message;

                // Set any required headers or parameters
                // client.DefaultRequestHeaders.Add("Authorization", "Bearer <token>");

                // Make the API call
                HttpResponseMessage response = client.PostAsync(apiUrl, null).Result;

                if (response.IsSuccessStatusCode)
                {
                    // Process the API response
                    return response.Content.ReadAsStringAsync().Result;
                    // ... Handle the response as needed
                }
                else
                {
                    return response.StatusCode.ToString();
                }
            }
        }
    }
}
