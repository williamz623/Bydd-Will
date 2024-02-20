namespace BYDWebApi.DTO.BYDCoin
{
    public class UserCoin: Coin
    {
        public string CoinStatus { get; set; }
        public string CoinStatusDesc { get; set; }
        public bool IfShipped { get; set; }
        public string ShippingCompany { get; set; }
        public string TrackingNumber { get; set; }
    }
}
