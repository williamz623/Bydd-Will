namespace BYDWebApi.DTO.User
{
    public class UserNotification : DTO.BYDCoin.Coin
    {
        public string UserName { get; set; }
        public string NotificationType { get; set; }
        public decimal NotificationPrice { get; set; }
        public DateTime NotificationDate { get; set; }
        public string NotificationContent { get; set; }
    }
}
