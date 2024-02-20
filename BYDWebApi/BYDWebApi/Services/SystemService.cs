using Newtonsoft.Json;
using Dapper;
using System.Data.SqlClient;
using System.Data;
using BYDWebApi.DTO.User;

namespace BYDWebApi.Services
{
    public class SystemService
    {
        public string _ConnectString;
        public SystemService()
        {
            var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .Build();
            _ConnectString = configuration.GetConnectionString("HangfireConnection");
        }

        public void SaveInfor(string msg)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@TestResult", msg);
               
               _db.Execute("dbo.System_Log", param, commandType: CommandType.StoredProcedure);
            }
        }

        public void SaveUserAccessInfor(string userIPAddress)
        {
            using (IDbConnection _db = new SqlConnection(_ConnectString))
            {
                //API KEY: cc0e1502b4b746f3295d58f394bb2d63
                string apiUrl = "http://api.ipstack.com/"+ userIPAddress.ToString() + "?access_key=cc0e1502b4b746f3295d58f394bb2d63";

                // Set any required headers or parameters
                // client.DefaultRequestHeaders.Add("Authorization", "Bearer <token>");

                // Make the API call
                HttpClient client = new HttpClient();
                HttpResponseMessage response = client.GetAsync(apiUrl).Result;

                LocationInfo locationInfo = new LocationInfo();
                if (response.IsSuccessStatusCode)
                {
                    string result = response.Content.ReadAsStringAsync().Result;
                    locationInfo = JsonConvert.DeserializeObject<LocationInfo>(result);
                }

                //get open contract list data
                DynamicParameters param = new DynamicParameters();
                param.Add("@UserIPAddress", userIPAddress);
                param.Add("@Country", locationInfo.country_name);
                param.Add("@Province", locationInfo.region_name);
                param.Add("@City", locationInfo.city);
                param.Add("@Latitude", locationInfo.latitude);
                param.Add("@Longitude", locationInfo.longitude);

                _db.Execute("dbo.User_IP_Address_Update", param, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
