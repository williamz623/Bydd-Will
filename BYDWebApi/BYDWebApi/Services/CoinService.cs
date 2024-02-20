﻿using Dapper;
using System.Data;
using System.Data.SqlClient;
using BYDWebApi.DTO.User;
using BYDWebApi.DTO.BYDCoin;
using System;
using BYDWebApi.DTO.Payment;
using Stripe;
using System.Text.Json;

namespace BYDWebApi.Services
{
  public class CoinService
  {
    public string _ConnectString;
    public CoinService()
    {
      var configuration = new ConfigurationBuilder()
      .SetBasePath(AppContext.BaseDirectory)
      .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
      .Build();
      _ConnectString = configuration.GetConnectionString("HangfireConnection");
    }

    public List<Coin> GetReferCoins()
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        var result = _db.QueryMultiple("dbo.ReferCoins_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        foreach (Coin coin in coins)
        {
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

        }
        //List<Coin> coins = _db.Query<Coin>("dbo.ReferCoins_List", param, commandType: CommandType.StoredProcedure).ToList();

        return coins;
      }
    }

    public List<Coin> GetCoinsInHomePage()
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        var result = _db.QueryMultiple("dbo.Coin_Home_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        foreach (Coin coin in coins)
        {
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

        }
        return coins;
      }
    }

    public List<CategoryCoin> GetCategoryCoins()
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        var result = _db.QueryMultiple("dbo.Category_Coin_List", param, commandType: CommandType.StoredProcedure);
        List<CategoryCoin> coins = result.Read<CategoryCoin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        foreach (Coin coin in coins)
        {
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            //imageContents.Add(coinImage.Image2);
            //imageContents.Add(coinImage.Image3);
            //imageContents.Add(coinImage.Image4);
            //imageContents.Add(coinImage.Image5);
            //imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

        }
        return coins;
      }
    }

    public List<DTO.BYDCoin.CoinNews> GetNews()
    {
      List<CoinNews> coinNews = new List<CoinNews>();
      coinNews.Add(new CoinNews() { NewsId = 1, ImageUrl = "assets/img/banner1.png", NewsDescription = "" });
      coinNews.Add(new CoinNews() { NewsId = 1, ImageUrl = "assets/img/banner2.png", NewsDescription = "" });
      coinNews.Add(new CoinNews() { NewsId = 1, ImageUrl = "assets/img/banner3.png", NewsDescription = "" });

      return coinNews;
      //using (IDbConnection _db = new SqlConnection(_ConnectString))
      //{
      //    //get open contract list data
      //    DynamicParameters param = new DynamicParameters();
      //    var result = _db.QueryMultiple("dbo.ReferCoins_List", param, commandType: CommandType.StoredProcedure);
      //    List<Coin> coins = result.Read<Coin>().ToList();
      //}
    }

    public List<Coin> getCompanyCoins(int companyId)
    {
      //string connectString = "Server=WINSVR2022-BYD; Initial Catalog=BYD;User ID=intranetuser;Password=devel0per;Connect Timeout=90";
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CompanyId", companyId);
        var result = _db.QueryMultiple("dbo.Company_Coin_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        foreach (Coin coin in coins)
        {
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

        }
        //List<Coin> coins = _db.Query<Coin>("dbo.ReferCoins_List", param, commandType: CommandType.StoredProcedure).ToList();

        return coins;
      }
    }

    public List<Coin> getCompanyCoins_Page(CoinPara coinPara)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        string[] paras = coinPara.ParaString.Split('^', StringSplitOptions.RemoveEmptyEntries);
        //get coin list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", coinPara.UserId);
        param.Add("@Skip", coinPara.Skip);
        param.Add("@PageSize", coinPara.PageSize);
        param.Add("@CategoryId", (paras.Length > 0 ? Int16.Parse(paras[0]) : 0));
        param.Add("@Keyword", (paras.Length > 1 ? paras[1] : ""));
        param.Add("@Filter", coinPara.Filter);
        param.Add("@Sort", coinPara.Sort);

        var result = _db.QueryMultiple("dbo.Coin_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        foreach (Coin c in coins)
        {
          List<string> imageContents = new List<string>();
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          c.ImageUrls = imageContents.ToArray();
        }

        return coins;
      }
    }

    public List<Coin> getCoinsByPage(CoinPara coinPara, int skip, int pageSize)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        string[] paras = coinPara.ParaString.Split('^', StringSplitOptions.RemoveEmptyEntries);
        //get coin list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", 0);
        param.Add("@Skip", coinPara.Skip);
        param.Add("@PageSize", coinPara.PageSize);
        param.Add("@CategoryId", (paras.Length > 0 ? Int16.Parse(paras[0]) : 0));
        param.Add("@Keyword", (paras.Length > 1 ? paras[1] : ""));
        param.Add("@Filter", coinPara.Filter);
        param.Add("@Sort", coinPara.Sort);
        param.Add("@LoadingImage250", dbType: DbType.String, size: 10000, direction: ParameterDirection.Output);
        param.Add("@LoadingImage550", dbType: DbType.String, size: 10000, direction: ParameterDirection.Output);
        param.Add("@LoadingImage1000", dbType: DbType.String, size: 10000, direction: ParameterDirection.Output);

        var result = _db.QueryMultiple("dbo.Coin_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();

        string loadingImage1 = param.Get<string>("@LoadingImage250");
        string loadingImage2 = param.Get<string>("@LoadingImage250");
        string loadingImage3 = param.Get<string>("@LoadingImage250");

        foreach (Coin c in coins)
        {
          List<string> imageContents = new List<string>();
          imageContents.Add(loadingImage1);
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          imageContents.Add("");
          c.ImageUrls = imageContents.ToArray();
        }

        return coins;
      }
    }

    public List<CoinImage> getCoinImageById(int coinId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoidId", coinId);
        var result = _db.QueryMultiple("dbo.Coin_Image_List", param, commandType: CommandType.StoredProcedure);
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        return coinImages;
      }
    }

    public List<CoinImage> getCoinIndexImageById(int coinId, int imageIndex)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoidId", coinId);
        param.Add("@ImageIndex", imageIndex);
        var result = _db.QueryMultiple("dbo.Coin_Index_Image_Get", param, commandType: CommandType.StoredProcedure);
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        return coinImages;
      }
    }

    public List<CoinImage> getCoinOriginalImageById(int coinId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoidId", coinId);
        var result = _db.QueryMultiple("dbo.Coin_Original_Image_List", param, commandType: CommandType.StoredProcedure);
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        return coinImages;
      }
    }

    public List<CoinWatchlist> getMyWatchList(int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", userId);
        var result = _db.QueryMultiple("dbo.User_WatchList_List", param, commandType: CommandType.StoredProcedure);
        List<CoinWatchlist> coins = result.Read<CoinWatchlist>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        foreach (CoinWatchlist coin in coins)
        {
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

        }

        return coins;
      }
    }

    public List<UserNotification> getUserNotifications(int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", userId);
        var result = _db.QueryMultiple("dbo.User_Notifications_List", param, commandType: CommandType.StoredProcedure);
        List<UserNotification> userNotifications = result.Read<UserNotification>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        foreach (UserNotification coin in userNotifications)
        {
          //coin image
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();
        }

        return userNotifications;
      }
    }

    public List<Coin> getUserOffer(int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", userId);
        var result = _db.QueryMultiple("dbo.User_Offer_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        List<CoinOffer> coinOffers = result.Read<CoinOffer>().ToList();
        foreach (Coin coin in coins)
        {
          //coin image
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

          //coin offer
          CoinOffer coinOffer = coinOffers.Find(f => f.CoinId == coin.CoinId);
          coin.CoinOffer = coinOffer;
        }

        return coins;
      }
    }

    public List<Coin> getUserOrder(int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", userId);
        var result = _db.QueryMultiple("dbo.User_Order_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        List<CoinOrder> coinOrders = result.Read<CoinOrder>().ToList();
        foreach (Coin coin in coins)
        {
          //coin image
          CoinImage? coinImage = coinImages.Find(f => f.CoinId == coin.CoinId);
          List<string> imageContents = new List<string>();
          if (null != coinImage)
          {
            imageContents.Add(coinImage.Image1);
            imageContents.Add(coinImage.Image2);
            imageContents.Add(coinImage.Image3);
            imageContents.Add(coinImage.Image4);
            imageContents.Add(coinImage.Image5);
            imageContents.Add(coinImage.Image6);
          }
          coin.ImageUrls = imageContents.ToArray();

          //coin order
          CoinOrder coinOrder = coinOrders.Find(f => f.CoinId == coin.CoinId);
          if (null != coinOrder) coinOrder.NeedCheckOut = true;
          coin.CoinOrder = coinOrder;
        }

        return coins;
      }
    }

    public List<CoinPurchase> getUserPurchase(int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", userId);
        var result = _db.QueryMultiple("dbo.User_Purchase_List", param, commandType: CommandType.StoredProcedure);
        List<Coin> coins = result.Read<Coin>().ToList();
        List<CoinImage> coinImages = result.Read<CoinImage>().ToList();
        List<CoinPurchase> coinPurchase = result.Read<CoinPurchase>().ToList();

        return coinPurchase;
      }
    }

    public List<UserCoin> getUserCoins(int companyId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@UserId", companyId);
        var result = _db.QueryMultiple("dbo.User_Coin_List", param, commandType: CommandType.StoredProcedure);
        List<UserCoin> coins = result.Read<UserCoin>().ToList();

        return coins;
      }
    }

    public int AcceptOffer(CoinOffer coinOffer)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", coinOffer.CoinId);
        param.Add("@UserId", coinOffer.UserId);
        param.Add("@OfferPrice", coinOffer.OfferPrice);
        param.Add("@UserEmail", dbType: DbType.String, size: 100, direction: ParameterDirection.Output);

        _db.Execute("dbo.User_Coin_Offer_Accept", param, commandType: CommandType.StoredProcedure);
        string userEmail = param.Get<string>("@UserEmail");

        //send offer email to seller
        if (!string.IsNullOrEmpty(userEmail))
        {
          EmailService emailService = new EmailService();
          emailService.SendUserOfferAccepted(coinOffer.CoinName, userEmail);
        }

        return 1;
      }
    }

    public int RejectOffer(CoinOffer coinOffer)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", coinOffer.CoinId);
        param.Add("@UserId", coinOffer.UserId);
        param.Add("@OfferPrice", coinOffer.OfferPrice);
        param.Add("@UserEmail", dbType: DbType.String, size: 100, direction: ParameterDirection.Output);

        _db.Execute("dbo.User_Coin_Offer_Reject", param, commandType: CommandType.StoredProcedure);
        string userEmail = param.Get<string>("@UserEmail");

        //send offer email to seller
        if (!string.IsNullOrEmpty(userEmail))
        {
          EmailService emailService = new EmailService();
          emailService.SendUserOfferRejected(coinOffer.CoinName, userEmail);
        }

        return 1;
      }
    }

    public int RemoveCoinFromOrder(WatchCoin coin)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", coin.CoinId);
        param.Add("@UserId", coin.UserId);

        _db.Execute("dbo.User_Coin_Order_Remove", param, commandType: CommandType.StoredProcedure);

        return 1;
      }
    }

    public decimal checkUserCoinOffer(WatchCoin coin)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", coin.CoinId);
        param.Add("@UserId", coin.UserId);
        param.Add("@OfferPrice", dbType: DbType.Currency, direction: ParameterDirection.Output);

        _db.Execute("dbo.User_Coin_Offer_Check", param, commandType: CommandType.StoredProcedure);
        decimal officePrice = param.Get<decimal>("@OfferPrice");
        return officePrice;
      }
    }

    public int BuyCoin(WatchCoin watchCoin)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", watchCoin.CoinId);
        param.Add("@UserId", watchCoin.UserId);

        _db.Execute("dbo.User_Coin_Buy", param, commandType: CommandType.StoredProcedure);

        //send email to seller
        DynamicParameters param1 = new DynamicParameters();
        param1.Add("@CoinId", watchCoin.CoinId);
        var results = _db.QueryMultiple("dbo.Coin_Get_By_Id", param1, commandType: CommandType.StoredProcedure);
        Coin coinSeller = results.Read<Coin>().FirstOrDefault();

        EmailService emailService = new EmailService();

        //send email to seller
        emailService.SendCoinSoldInfoToSeller(coinSeller);

        return 1;
      }
    }

    public List<Coin> AddNewCoin(Coin newCoin, int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@Name", newCoin.Name);
        param.Add("@Description", newCoin.Description);
        param.Add("@StartPrice", newCoin.StartPrice);
        param.Add("@Interval", newCoin.Interval);
        param.Add("@Increment", newCoin.Increment);
        param.Add("@LowestPrice", newCoin.LowestPrice);

        param.Add("@CategoryId", newCoin.CategoryId);
        param.Add("@StartDateTime", newCoin.StartDateTime);
        param.Add("@EndDateTime", newCoin.EndDateTime);

        param.Add("@carrierNameDomestic", newCoin.CarrierNameDomestic);
        param.Add("@ServiceTypeDomestic", newCoin.ServiceTypeDomestic);
        param.Add("@ShippingFeeDomestic", newCoin.ShippingFeeDomestic);
        param.Add("@CarrierNameInternational", newCoin.CarrierNameInternational);
        param.Add("@ServiceTypeInternational", newCoin.ServiceTypeInternational);
        param.Add("@ShippingFeeInternational", newCoin.ShippingFeeInternational);

        param.Add("@ImageUrl1", newCoin.ImageUrls[0]);
        param.Add("@ImageUrl2", newCoin.ImageUrls[1]);
        param.Add("@ImageUrl3", newCoin.ImageUrls[2]);
        param.Add("@ImageUrl4", newCoin.ImageUrls[3]);
        param.Add("@ImageUrl5", newCoin.ImageUrls[4]);
        param.Add("@ImageUrl6", newCoin.ImageUrls[5]);
        param.Add("@ImageUrl1_Original", newCoin.OriginalImageUrls[0]);
        param.Add("@ImageUrl2_Original", newCoin.OriginalImageUrls[1]);
        param.Add("@ImageUrl3_Original", newCoin.OriginalImageUrls[2]);
        param.Add("@ImageUrl4_Original", newCoin.OriginalImageUrls[3]);
        param.Add("@ImageUrl5_Original", newCoin.OriginalImageUrls[4]);
        param.Add("@ImageUrl6_Original", newCoin.OriginalImageUrls[5]);
        param.Add("@UserId", userId);

        List<Coin> coins = _db.Query<Coin>("dbo.Coin_Add", param, commandType: CommandType.StoredProcedure).ToList();

        return coins;
      }
    }

    public List<Coin> ModifyCoin(Coin newCoin, int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoidId", newCoin.CoinId);
        param.Add("@Name", newCoin.Name);
        param.Add("@Description", newCoin.Description);
        param.Add("@StartPrice", newCoin.StartPrice);
        param.Add("@Interval", newCoin.Interval);
        param.Add("@Increment", newCoin.Increment);
        param.Add("@LowestPrice", newCoin.LowestPrice);

        param.Add("@CategoryId", newCoin.CategoryId);
        param.Add("@StartDateTime", newCoin.StartDateTime);
        param.Add("@EndDateTime", newCoin.EndDateTime);

        param.Add("@carrierNameDomestic", newCoin.CarrierNameDomestic);
        param.Add("@ServiceTypeDomestic", newCoin.ServiceTypeDomestic);
        param.Add("@ShippingFeeDomestic", newCoin.ShippingFeeDomestic);
        param.Add("@CarrierNameInternational", newCoin.CarrierNameInternational);
        param.Add("@ServiceTypeInternational", newCoin.ServiceTypeInternational);
        param.Add("@ShippingFeeInternational", newCoin.ShippingFeeInternational);

        param.Add("@ImageUrl1", newCoin.ImageUrls[0]);
        param.Add("@ImageUrl2", newCoin.ImageUrls[1]);
        param.Add("@ImageUrl3", newCoin.ImageUrls[2]);
        param.Add("@ImageUrl4", newCoin.ImageUrls[3]);
        param.Add("@ImageUrl5", newCoin.ImageUrls[4]);
        param.Add("@ImageUrl6", newCoin.ImageUrls[5]);
        param.Add("@ImageUrl1_Original", newCoin.OriginalImageUrls[0]);
        param.Add("@ImageUrl2_Original", newCoin.OriginalImageUrls[1]);
        param.Add("@ImageUrl3_Original", newCoin.OriginalImageUrls[2]);
        param.Add("@ImageUrl4_Original", newCoin.OriginalImageUrls[3]);
        param.Add("@ImageUrl5_Original", newCoin.OriginalImageUrls[4]);
        param.Add("@ImageUrl6_Original", newCoin.OriginalImageUrls[5]);
        param.Add("@UserId", userId);

        List<Coin> coins = _db.Query<Coin>("dbo.Coin_Update", param, commandType: CommandType.StoredProcedure).ToList();

        return coins;
      }
    }

    public bool RemoveCoin(int coinId, int userId)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", coinId);
        param.Add("@UserId", userId);

        _db.Query<Coin>("dbo.Coin_Remove", param, commandType: CommandType.StoredProcedure);

        return true;
      }
    }

    public bool updateTrackingNumber(CoinTracking coinTracking)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@CoinId", coinTracking.CoinId);
        param.Add("@UserId", coinTracking.UserId);
        param.Add("@CarrierName", coinTracking.CarrierName);
        param.Add("@TrackingNumber", coinTracking.TrackingNumber);

        _db.Query<Coin>("dbo.Coin_Tracking_Update", param, commandType: CommandType.StoredProcedure);

        return true;
      }
    }

    #region "after payment succeed"
    public void UserPaymentSucceed(DTO.Payment.PaymentRequest paymentRequest)
    {
      using (IDbConnection _db = new SqlConnection(_ConnectString))
      {
        SystemService systemService = new SystemService();

        //get open contract list data
        DynamicParameters param = new DynamicParameters();
        param.Add("@PaymentMethodId", paymentRequest.PaymentMethodId);
        param.Add("@UserId", paymentRequest.UserId);
        param.Add("@SubTotal", paymentRequest.SubTotal);
        param.Add("@ShippingFee", paymentRequest.ShippingFee);
        param.Add("@Tax", paymentRequest.Tax);
        param.Add("@Amount", paymentRequest.Amount);
        param.Add("@CoinIds", string.Join(",", paymentRequest.CoinIds));
        param.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

        _db.Execute("dbo.User_Payment_Succeed_Update", param, commandType: CommandType.StoredProcedure);
        int result = param.Get<int>("@Result");

        systemService.SaveInfor("call [dbo.User_Payment_Succeed_Update] end.");

        //send coin invoice email
        if (result > 0)
        {
          DynamicParameters param1 = new DynamicParameters();
          param1.Add("@InvoiceId", result);
          var results = _db.QueryMultiple("dbo.User_Invoice_List", param1, commandType: CommandType.StoredProcedure);
          User user = results.Read<User>().FirstOrDefault();
          List<CoinShipping> coins = results.Read<CoinShipping>().ToList();


          EmailService emailService = new EmailService();

          //send invoice to buyer
          emailService.SendUserInvoice(result, user, coins);

          //send email to seller
          emailService.SendUserPaidInfoToCompany(user, coins);

        }
      }
    }
    #endregion
  }
}
