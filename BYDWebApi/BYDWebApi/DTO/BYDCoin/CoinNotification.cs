using BYDWebApi.DTO.User;

namespace BYDWebApi.DTO.BYDCoin
{
    public class CoinNotification: Coin
    {
        public List<UserNotification> UserNotifications { get; set; }
    }
}
