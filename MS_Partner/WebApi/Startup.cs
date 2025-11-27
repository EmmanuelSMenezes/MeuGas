using Application.Service;
using Domain.Model;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using Serilog;
using System.IO;
using System.Linq;
using System.Text;

namespace MS_Partner
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddMvc(option => option.EnableEndpointRouting = false);
            services.AddControllers().AddFluentValidation();
            services.AddControllers();
            services.AddCors();
            services.AddLogging();

            var key = Encoding.ASCII.GetBytes(Configuration.GetSection("MSPartnerSettings").GetSection("PrivateSecretKey").Value);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // Add framework services.

            services.AddSwaggerDocument(config =>
            {
                config.PostProcess = document =>
                {
                    document.Info.Version = "V1";
                    document.Info.Title = "PAM - Microservice Partner";
                    document.Info.Description = "API's Documentation of Microservice Partner of PAM Plataform";
                };

                config.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                });

                config.OperationProcessors.Add(
                    new AspNetCoreOperationSecurityScopeProcessor("JWT"));
            });

            string logFilePath = Configuration.GetSection("LogSettings").GetSection("LogFilePath").Value;
            string logFileName = Configuration.GetSection("LogSettings").GetSection("LogFileName").Value;

            string connectionString = Configuration.GetSection("MSPartnerSettings").GetSection("ConnectionString").Value;
            string privateSecretKey = Configuration.GetSection("MSPartnerSettings").GetSection("PrivateSecretKey").Value;
            string tokenValidationMinutes = Configuration.GetSection("MSPartnerSettings").GetSection("TokenValidationMinutes").Value;

            EmailSettings emailSettings = new EmailSettings()
            {
                PrimaryDomain = Configuration.GetSection("EmailSettings:PrimaryDomain").Value,
                PrimaryPort = Configuration.GetSection("EmailSettings:PrimaryPort").Value,
                UsernameEmail = Configuration.GetSection("EmailSettings:UsernameEmail").Value,
                UsernamePassword = Configuration.GetSection("EmailSettings:UsernamePassword").Value,
                FromEmail = Configuration.GetSection("EmailSettings:FromEmail").Value,
                ToEmail = Configuration.GetSection("EmailSettings:ToEmail").Value,
                CcEmail = Configuration.GetSection("EmailSettings:CcEmail").Value,
                EnableSsl = Configuration.GetSection("EmailSettings:EnableSsl").Value,
                UseDefaultCredentials = Configuration.GetSection("EmailSettings:UseDefaultCredentials").Value
            };

            HttpEndPoints httpEndPoints = new HttpEndPoints()
            {
                MSCommBaseUrl = Configuration.GetSection("HttpEndPoints").GetSection("MSCommBaseUrl").Value,
                MSCatalogUrl = Configuration.GetSection("HttpEndPoints").GetSection("MSCatalogUrl").Value
            };

            services.AddSingleton((ILogger)new LoggerConfiguration()
              .MinimumLevel.Debug()
              .WriteTo.File(Path.Combine(logFilePath, logFileName), rollingInterval: RollingInterval.Day)
              .WriteTo.Console(Serilog.Events.LogEventLevel.Debug)
              .CreateLogger());

            services.AddScoped<IPartnerRepository, PartnerRepository>(
                provider => new PartnerRepository(connectionString, provider.GetService<ILogger>()));

            services.AddScoped<IPartnerService, PartnerService>(
                provider => new PartnerService(provider.GetService<IPartnerRepository>(), provider.GetService<IBranchService>(),
                provider.GetService<ILogger>(), privateSecretKey, tokenValidationMinutes, httpEndPoints));

            services.AddScoped<IBranchRepository, BranchRepository>(
                provider => new BranchRepository(connectionString, provider.GetService<ILogger>()));

            services.AddScoped<IBranchService, BranchService>(
                provider => new BranchService(provider.GetService<IBranchRepository>(),
                provider.GetService<ILogger>(), privateSecretKey, tokenValidationMinutes));

            services.AddScoped<IBankRepository, BankRepository>(
               provider => new BankRepository(connectionString, provider.GetService<ILogger>()));

            services.AddScoped<IBankService, BankService>(
                provider => new BankService(provider.GetService<IBankRepository>(),
                provider.GetService<ILogger>(), privateSecretKey, tokenValidationMinutes));

            services.AddTransient<IValidator<CreateBankRequest>, CreateBankRequestValidator>();
            services.AddTransient<IValidator<UpdateBankRequest>, UpdateBankRequestValidator>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseOpenApi();
            // add the Swagger generator and the Swagger UI middlewares   
            app.UseSwaggerUi3();

            app.UseReDoc(options =>
            {
                options.RoutePrefix = "docs";
                options.DocumentTitle = "Microservice Workflow - PAM";
            });

            app.UseCors(builder => builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseMvc();


        }
    }
}