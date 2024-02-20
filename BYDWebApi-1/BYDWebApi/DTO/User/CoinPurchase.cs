namespace BYDWebApi.DTO.User
{
    public class CoinPurchase : CoinOrder
    {
        public string CoinName { get; set; }
        public string ShippingCompany { get; set; }
        public DateTime ShippingDate { get; set; }
        public string TrackingNumber { get; set; }
    }
}
