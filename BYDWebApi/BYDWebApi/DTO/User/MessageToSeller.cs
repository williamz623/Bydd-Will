namespace BYDWebApi.DTO.User
{
    public class MessageToSeller
    {
        public int CoinId { get; set; }
        public string CoinName { get; set; }
        public int UserId { get; set; }
        public string UserDisplayName { get; set; }
        public string UserEmail { get; set; }
        public int SellerId { get; set; }
        public string SellerDisplayName { get; set; }
        public string SellerEmail { get; set; }
        public string Message { get; set; }
        public string MessageIndicator { get; set; }
        public DateTime EnterDate { get; set; }
    }
}
