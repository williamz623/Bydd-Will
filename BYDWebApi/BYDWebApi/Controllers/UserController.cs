using BYDWebApi.DTO;
using BYDWebApi.DTO.BYDCoin;
using BYDWebApi.DTO.User;
using BYDWebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;
using System.Security.Claims;

namespace BYDWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        [HttpPost("addNewUser", Name = "AddNewUser")]
        public IActionResult AddNewUser(DTO.User.User newUser)
        {
            UserService userService = new UserService();
            string result = userService.AddNewUser(newUser);
            return Ok(result);
        }

        [HttpGet]
        [Route("checkUserExisted")]
        public IActionResult checkUserExisted([FromQuery] string userEmail)
        {
            UserService userService = new UserService();
            int result = userService.checkUserExisted(userEmail);
            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        [Route("GetUserProfile")]
        public IActionResult GetUserProfile()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var userClaims = identity.Claims;
                var userEmail = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

                UserService userService = new UserService();
                User user = userService.GetUserProfile(userEmail);
                return Ok(user);
            } else {
                return Ok(-1);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("UpdateUserProfile")]
        public IActionResult UpdateUserProfile(DTO.User.User user)
        {
            UserService userService = new UserService();
            string result = userService.UpdateUserProfile(user);
            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        [Route("AddCoinToWatchlist")]
        public IActionResult AddCoinToWatchlist(WatchCoin watchCoin)
        {
            UserService userService = new UserService();
            List<int> result = userService.AddCoinToWatchlist(watchCoin);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("RemoveCoinFromWatchlist")]
        public IActionResult RemoveCoinFromWatchlist(WatchCoin watchCoin)
        {
            UserService userService = new UserService();
            List<int> result = userService.RemoveCoinFromWatchlist(watchCoin);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("SendOffer")]
        public IActionResult SendOffer(CoinOffer coinOffer)
        {
            UserService userService = new UserService();
            CoinOffer result = userService.SendOffer(coinOffer);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("RetractOffer")]
        public IActionResult RetractOffer(CoinOffer coinOffer)
        {
            UserService userService = new UserService();
            CoinOffer result = userService.RetractOffer(coinOffer);
            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        [Route("NotifyMe")]
        public IActionResult NotifyMe(CoinNotify coin)
        {
            UserService userService = new UserService();
            int result = userService.NotifyMe(coin);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("CancelNotify")]
        public IActionResult CancelNotify(CoinNotify coin)
        {
            UserService userService = new UserService();
            int result = userService.CancelNotify(coin);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("SendMessage")]
        public IActionResult SendMessage(MessageToSeller msgToSeller)
        {
            UserService userService = new UserService();
            userService.SaveMessage(msgToSeller);

            bool result = userService.SendMessage(msgToSeller);
            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        [Route("getUserInvoices")]
        public IEnumerable<UserInvoice> getUserInvoices([FromQuery] int userId)
        {
            UserService userService = new UserService();
            List<UserInvoice> userInvoices = userService.getUserInvoices(userId);
            return userInvoices;
        }

        [HttpGet]
        [Authorize]
        [Route("getCoinUserMessage")]
        public IEnumerable<MessageToSeller> getCoinUserMessage([FromQuery] int coinId, int userId)
        {
            UserService userService = new UserService();
            List<MessageToSeller> messageToSeller = userService.getCoinUserMessage(coinId, userId);
            return messageToSeller;
        }

        [HttpGet]
        [Authorize]
        [Route("setCoinUserMessageHadRead")]
        public IActionResult setCoinUserMessageHadRead([FromQuery] int coinId, int userId)
        {
            UserService userService = new UserService();
            bool result = userService.setCoinUserMessageHadRead(coinId, userId);
            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        [Route("submitContactMessage")]
        public IActionResult submitContactMessage(ContactMessage contactMessage)
        {
            UserService userService = new UserService();
            bool result = userService.submitContactMessage(contactMessage);
            return Ok(result);
        }
        



        [HttpPost]
        [Route("forgetPassword")]
        public IActionResult forgetPassword([FromBody] UserBase userBase)
        {
            UserService userService = new UserService();
            string currentUrl = "ResetPassword?guid=";
            if (HttpContext.Request.Host.ToString().ToLower().IndexOf("localhost") > -1)
            {
                currentUrl = "http://localhost:4200/" + currentUrl;
            }
            if (HttpContext.Request.Host.ToString().ToLower().IndexOf("10.0.0.120") > -1)
            {
                currentUrl = "http://10.0.0.120/byd/" + currentUrl;
            }
            if (HttpContext.Request.Host.ToString().ToLower().IndexOf("byddauctions.com") > -1)
            {
                currentUrl = "http://www.byddauctions.com/" + currentUrl;
            }
            int result = userService.forgetPassword(userBase.Username, currentUrl);
            return Ok();
        }

        [HttpPost]
        [Route("changePassword")]
        public IActionResult changePassword([FromBody] UserNewPassword userNewPassword)
        {
            UserService userService = new UserService();
            int result = userService.changePassword(userNewPassword);
            return Ok(result);
        }

        
        [HttpGet]
        [Route("getCountries")]
        public IActionResult getCountries()
        {
            UserService userService = new UserService();
            List<Country> countries = userService.GetCountries();
            return Ok(countries);
        }

    }
}
