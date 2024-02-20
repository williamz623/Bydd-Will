namespace BYDWebApi.DTO.User
{
    public class SellerCoinOffer: CoinOffer
    {
        public int SellerId { get; set; }
        public string SellerName { get; set; }
        public string SellerEmail { get; set; }
    }
}
