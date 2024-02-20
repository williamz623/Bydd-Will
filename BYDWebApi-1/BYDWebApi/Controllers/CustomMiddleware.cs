using System.Net;

namespace BYDWebApi.Controllers
{
    public class CustomMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            var ipAddress = context.Connection.RemoteIpAddress;
            if (ipAddress != null && !IPAddress.IsLoopback(ipAddress))
            {
                BYDWebApi.Services.SystemService systemService = new Services.SystemService();
                systemService.SaveUserAccessInfor(ipAddress.ToString());
            }

            // Call the next middleware in the pipeline
            await next(context);
        }
    }
}
