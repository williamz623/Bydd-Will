using BYDWebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace BYDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private const string StripeApiKey = //"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";
            "sk_test_51NJqgDLgI6S7ZMtJvYdO3MmzRftDGS5aLBGlNMiQfS32rwhSfgIbwNHqbzH18jxtZaM6hosRdlJcwq7CuDgSHvnf00QRD7GtLk";

        [HttpPost]
        [Authorize]
        public IActionResult ProcessPayment(DTO.Payment.PaymentRequest paymentRequest)
        {
            SystemService systemService = new SystemService();


            StripeConfiguration.ApiKey = StripeApiKey;

            var options = new PaymentIntentCreateOptions
            {
                Amount = paymentRequest.Amount,
                Currency = "usd",
                PaymentMethod = paymentRequest.PaymentMethodId,
                ConfirmationMethod = "manual",
                Confirm = true
            };

            systemService.SaveInfor("prcess payment");

            try
            {
                var service = new PaymentIntentService();
                var paymentIntent = service.Create(options);

                systemService.SaveInfor(paymentIntent.Status);

                //process backend logic: remove order, create invoice etc
                if (paymentIntent.Status == "succeeded")
                {
                    CoinService coinService = new CoinService();
                    coinService.UserPaymentSucceed(paymentRequest);
                }

                // Handle the payment intent response and return the result
                return Ok(paymentIntent);
            } catch( Exception e)
            {
                systemService.SaveInfor(e.Message);
                return BadRequest(e.Message);
            }
        }
    }
}
