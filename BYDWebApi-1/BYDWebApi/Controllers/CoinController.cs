using Microsoft.AspNetCore.Mvc;
using BYDWebApi.Services;
using BYDWebApi.DTO.User;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BYDWebApi.DTO.BYDCoin;
using BYDWebApi.DTO.Payment;

namespace BYDWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoinController : ControllerBase
    {

        [HttpGet("getrefercoins", Name = "GetReferCoins")]
        public IEnumerable<Coin> GetReferCoins()
        {
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.GetReferCoins();
            return coins;
        }

        
        [HttpGet("getCoinsInHomePage", Name = "GetCoinsInHomePage")]
        public IEnumerable<Coin> GetCoinsInHomePage()
        {
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.GetCoinsInHomePage();
            return coins;
        }

        [HttpGet("getCategoryCoins", Name = "GetCategoryCoins")]
        public IEnumerable<Coin> GetCategoryCoins()
        {
            CoinService coinService = new CoinService();
            List<CategoryCoin> coins = coinService.GetCategoryCoins();
            return coins;
        }
        

        [HttpGet("getNews", Name = "GetNews")]
        public IEnumerable<CoinNews> getNews()
        {
            CoinService coinService = new CoinService();
            List<CoinNews> coins = coinService.GetNews();
            return coins;
        }

        [HttpGet]
        [Authorize]
        [Route("getCompanyCoins")]
        public IEnumerable<Coin> getCompanyCoins([FromQuery] int companyId) 
        {
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.getCompanyCoins(companyId);
            return coins;
        }

        [HttpPost]
        [Route("getCompanyCoinsByPage")]
        [Authorize]
        public IEnumerable<Coin> getCompanyCoins_Page([FromBody] CoinPara coinPara)
        {
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.getCompanyCoins_Page(coinPara);
            return coins;
        }

        [HttpPost]
        [Route("getCoinsByPage")]
        public IEnumerable<Coin> getCoinsByPage([FromBody] CoinPara coinPara)
        {
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.getCoinsByPage(coinPara, coinPara.Skip, coinPara.PageSize);
            return coins;
        }


        [HttpGet]
        [Route("getCoinImageById")]
        public IEnumerable<CoinImage> getCoinImageById([FromQuery] int coinId)
        {
            CoinService coinService = new CoinService();
            List<CoinImage> coinImages = coinService.getCoinImageById(coinId);
            return coinImages;
        }

        [HttpGet]
        [Route("getCoinIndexImageById")]
        public IEnumerable<CoinImage> getCoinIndexImageById([FromQuery] int coinId, int imageIndex)
        {
            CoinService coinService = new CoinService();
            List<CoinImage> coinImages = coinService.getCoinIndexImageById(coinId, imageIndex);
            return coinImages;
        }
        


        [HttpGet]
        [Route("getCoinOriginalImageById")]
        public IEnumerable<CoinImage> getCoinOriginalImageById([FromQuery] int coinId)
        {
            CoinService coinService = new CoinService();
            List<CoinImage> coinImages = coinService.getCoinOriginalImageById(coinId);
            return coinImages;
        }


        [HttpGet]
        [Route("getMyWatchList")]
        [Authorize]
        public IEnumerable<Coin> getMyWatchList([FromQuery] int userId)
        {
            CoinService coinService = new CoinService();
            List<CoinWatchlist> coins = coinService.getMyWatchList(userId);
            return coins;
        }

        [HttpGet]
        [Authorize]
        [Route("getUserNotifications")]
        public IEnumerable<UserNotification> getUserNotifications([FromQuery] int userId)
        {
            CoinService coinService = new CoinService();
            List<UserNotification> userNotifications = coinService.getUserNotifications(userId);
            return userNotifications;
        }

        [HttpGet]
        [Authorize]
        [Route("getUserOffer")]
        public IEnumerable<Coin> getUserOffer([FromQuery]int userId)
        {
            CoinService coinService = new CoinService();
            List<Coin> myCoinOffers = coinService.getUserOffer(userId);
            return myCoinOffers;
        }

        [HttpPost]
        [Authorize]
        [Route("AcceptOffer")]
        public IActionResult AcceptOffer([FromBody]CoinOffer coinOffer)
        {
            CoinService coinService = new CoinService();
            int result = coinService.AcceptOffer(coinOffer);
            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        [Route("RejectOffer")]
        public IActionResult RejectOffer([FromBody] CoinOffer coinOffer)
        {
            CoinService coinService = new CoinService();
            int result = coinService.RejectOffer(coinOffer);
            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        [Route("RemoveCoinFromOrder")]
        public IActionResult RemoveCoinFromOrder([FromBody] WatchCoin coin)
        {
            CoinService coinService = new CoinService();
            int result = coinService.RemoveCoinFromOrder(coin);
            return Ok(result);
        }
        

        [HttpPost]
        [Authorize]
        [Route("checkUserCoinOffer")]
        public IActionResult checkUserCoinOffer([FromBody] WatchCoin coin)
        {
            CoinService coinService = new CoinService();
            decimal result = coinService.checkUserCoinOffer(coin);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("BuyCoin")]
        public IActionResult BuyCoin(WatchCoin coin)
        {
            CoinService coinService = new CoinService();
            int result = coinService.BuyCoin(coin);
            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        [Route("userPaymentSucceed")]
        public IActionResult userPaymentSucceed(DTO.Payment.PaymentRequest paymentRequest)
        {
            CoinService coinService = new CoinService();
            coinService.UserPaymentSucceed(paymentRequest);
            return Ok(1);
        }
        

        [HttpGet]
        [Authorize]
        [Route("getUserOrder")]
        public IEnumerable<Coin> getUserOrder([FromQuery] int userId)
        {
            CoinService coinService = new CoinService();
            List<Coin> myCoinOffers = coinService.getUserOrder(userId);
            return myCoinOffers;
        }
        

        [HttpGet]
        [Authorize]
        [Route("getUserPurchase")]
        public IEnumerable<CoinPurchase> getUserPurchase([FromQuery] int userId)
        {
            CoinService coinService = new CoinService();
            List<CoinPurchase> userPurchase = coinService.getUserPurchase(userId);
            return userPurchase;
        }

        [HttpGet]
        [Authorize]
        [Route("getUserCoins")]
        public IEnumerable<UserCoin> getUserCoins([FromQuery] int userId)
        {
            CoinService coinService = new CoinService();
            List<UserCoin> userCoins = coinService.getUserCoins(userId);
            return userCoins;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(List<IFormFile> files)
        {
            // Check if any file is null or not
            if (files == null || files.Count == 0)
            {
                return BadRequest("Files not selected");
            }

            var uploadedFiles = new List<object>();

            // Save each file to a file system
            foreach (var file in files)
            {
                if (file.Length == 0)
                {
                    continue;
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = "";
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                uploadedFiles.Add(new { name = file.FileName, size = file.Length, url = $"/uploads/{fileName}" });
            }

            // Return a JSON response with the file information
            return Ok(uploadedFiles);
        }

        [Authorize]
        [HttpPost("addNewCoin")]
        public IEnumerable<Coin> AddNewCoin(Coin newCoin)
        {
            int userId = newCoin.UserId;
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.AddNewCoin(newCoin, userId);
            return coins;
        }

        [Authorize]
        [HttpPost("modifyCoin")]
        public IEnumerable<Coin> ModifyCoin(Coin coin)
        {
            int userId = coin.UserId;
            CoinService coinService = new CoinService();
            List<Coin> coins = coinService.ModifyCoin(coin, userId);
            return coins;
        }


        [HttpPost("removeCoin")]
        [Authorize]
        public IActionResult RemoveCoin([FromBody]CoinBase coinPara)
        {
            CoinService coinService = new CoinService();
            coinService.RemoveCoin(coinPara.CoinId, coinPara.UserId);
            return Ok(1);
        }

        [HttpPost("updateTrackingNumber")]
        [Authorize]
        public IActionResult updateTrackingNumber([FromBody] CoinTracking coinTracking)
        {
            CoinService coinService = new CoinService();
            coinService.updateTrackingNumber(coinTracking);
            return Ok(1);
        }
    }
}
