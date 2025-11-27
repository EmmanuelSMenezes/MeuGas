using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using System.Linq;
using System.Text;
using Domain.Model;
using Application.Service;
using Infrastructure.Repository;
using Serilog;

namespace MS_Storage
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

      var key = Encoding.ASCII.GetBytes(Configuration.GetSection("MSStorageSettings").GetSection("PrivateSecretKey").Value);
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
            document.Info.Title = "PAM - Microservice Storage";
            document.Info.Description = "API's Documentation of Microservice Storage of PAM Plataform";
          };

        config.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
        {
          Type = OpenApiSecuritySchemeType.ApiKey,
          Name = "Authorization",
          In = OpenApiSecurityApiKeyLocation.Header,
        });

        config.OperationProcessors.Add(
          new AspNetCoreOperationSecurityScopeProcessor("JWT")
        );
      });

      string privateSecretKey = Configuration.GetSection("MSStorageSettings").GetSection("PrivateSecretKey").Value;
      string tokenValidationMinutes = Configuration.GetSection("MSStorageSettings").GetSection("TokenValidationMinutes").Value;
      MinioSettings minioSettings = new MinioSettings()
      {
        Host = Configuration.GetSection("MSStorageSettings").GetSection("MinioSettings").GetSection("Host").Value,
        Username = Configuration.GetSection("MSStorageSettings").GetSection("MinioSettings").GetSection("Username").Value,
        Password = Configuration.GetSection("MSStorageSettings").GetSection("MinioSettings").GetSection("Password").Value
      };

      services.AddSingleton((ILogger) new LoggerConfiguration()
              .MinimumLevel.Debug()
              .WriteTo.Console(Serilog.Events.LogEventLevel.Debug)
              .CreateLogger());

      services.AddScoped<IStorageRepository, StorageRepository>(provider => new StorageRepository(minioSettings, provider.GetService<ILogger>()));
      services.AddScoped<IStorageService, StorageService>(provider => new StorageService(provider.GetService<IStorageRepository>(), provider.GetService<ILogger>()));
      
      services.AddTransient<IValidator<UploadFileRequest>, UploadFileRequestValidator>();


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