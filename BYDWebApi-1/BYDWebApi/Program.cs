using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using BYDWebApi.Services;
using static BYDWebApi.Services.SignalRServiceHub;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.Extensions.Configuration;
using System;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add custom midware
builder.Services.AddScoped<BYDWebApi.Controllers.CustomMiddleware>(); // Register the custom middleware

//JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            // Skip the default logic.
            context.HandleResponse();

            //context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            //context.Response.ContentType = "application/json";

            // Use context.HttpContext.WriteAsync to write the result.
            return context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "You are not authorized." }));
        },
        OnAuthenticationFailed = context =>
        {
            var errorMessage = "An unknown error occurred.";

            if (context.Exception is SecurityTokenInvalidIssuerException)
            {
                errorMessage = "The token's issuer is invalid.";
            }
            else if (context.Exception is SecurityTokenInvalidAudienceException)
            {
                errorMessage = "The token's audience is invalid.";
            }
            else if (context.Exception is SecurityTokenExpiredException)
            {
                errorMessage = "The token is expired.";
            }
            // Add more if statements here as needed to handle different exceptions.

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";

            return context.Response.WriteAsync(JsonSerializer.Serialize(new { error = errorMessage }));
        }
    };
});



var configuration = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();
var connectionString = configuration.GetConnectionString("HangfireConnection");
var environment = configuration.GetValue<string>("Environment");


var policyName = "defaultCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(policyName, builder =>
    {
        builder.WithOrigins(environment) // the Angular app url
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
builder.Services.AddSignalR();
builder.Services.AddSingleton<SignalRServiceHub>();


// Hangfire configuration
builder.Services.AddHangfire(config =>{ config.UseSqlServerStorage(connectionString); });



var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policyName);


app.UseAuthentication();


app.UseAuthorization();


app.UseMiddleware<BYDWebApi.Controllers.CustomMiddleware>();


app.MapControllers();


app.MapHub<BYDWebApi.Services.SignalRServiceHub>("/signalRServiceHub");

// Enable Hangfire dashboard
app.UseHangfireDashboard();

// Start Hangfire server
app.UseHangfireServer();

// Schedule recurring job
HangfireJob hfJob = new HangfireJob();
RecurringJob.AddOrUpdate(() => hfJob.YourMethodToRunDaily(), Cron.Hourly); //.Daily);

//hangfire


app.Run();
