namespace BYDWebApi.DTO.User
{
    public class CoinNotifyMessage : CoinNotify
    {
        public string UserDisplayName { get; set; }
        public string UserEmail { get; set; }
        public string CoinName { get; set; }
        public decimal CurrentPrice { get; set; }
    }
}
