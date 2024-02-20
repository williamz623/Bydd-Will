namespace BYDWebApi.DTO.User
{
    public class UserInvoice
    {
        public int InvoiceId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Tax { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal Amount { get; set; }
        public string InvoiceStatusCode { get; set; }
        public string InvoiceStatusDesc { get; set; }
        public DateTime UpdatedDateTime { get; set; }
        public int CustomerId { get; set; }
        public string PaymentMethodId { get; set; }
        public int CoinId { get; set; }
        public string Name { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal ServiceFee { get; set; }
        public decimal CoinShippingFee { get; set; }
        public decimal CoinTax { get; set; }
        public decimal Total { get; set; }
    }
}
