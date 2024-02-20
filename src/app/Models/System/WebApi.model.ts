export class WebApi {
    static API_LOCAL = 'https://localhost:7084';
    static API_DEV = 'http://10.0.0.120/BYDWebApi';
    static API_PROD = 'https://www.byddauctions.com/bydwebapi';
    static BYD_API = (window.location.href.indexOf("localhost")>-1)? WebApi.API_LOCAL:(window.location.href.toUpperCase().indexOf("10.0.0.120")>-1)?WebApi.API_DEV:WebApi.API_PROD;
  
    static Token_LOCAL = 'https://localhost:7073';
    static Token_DEV = 'http://10.0.0.120/BYDToken';
    static Token_PROD = 'https://www.byddauctions.com/bydToken';
    static BYD_Token = (window.location.href.indexOf("localhost")>-1)? WebApi.Token_LOCAL:(window.location.href.toUpperCase().indexOf("10.0.0.120")>-1)?WebApi.Token_DEV:WebApi.Token_PROD;
  
    static ENABLE_REQUEST_LOG = false;
  
  }