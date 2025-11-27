using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Domain.Model;
using Newtonsoft.Json;
using Serilog;

namespace Application.Service
{
  public class CommunicationService : ICommunicationService
  {
    private readonly ILogger _logger;
    private readonly HttpEndPoints _httpEndPoints;

    public CommunicationService(
      ILogger logger,
      HttpEndPoints httpEndPoints
      )
    {
      _logger = logger;
      _httpEndPoints = httpEndPoints;
    }
    public async Task<bool> SendMail(string email, string subject, string body, string token)
    {
      try
      {
        SendEmailRequest request = new SendEmailRequest()
        {
          Email = email,
          Body = body,
          Subject = subject
        };
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await httpClient.PostAsync(
          $"{_httpEndPoints.MSCommunicationBaseUrl}email/send",
          new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json")
        );

        if (((int)response.StatusCode) > 300) throw new Exception("errorWhileSentEmail");


        return response.IsSuccessStatusCode;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public async Task<bool> SendSMS(string number, string body, string token)
    {
      try
      {
        SendSMSRequest request = new SendSMSRequest()
        {
          ToPhoneNumber = number,
          Body = body
        };
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await httpClient.PostAsync(
          $"{_httpEndPoints.MSCommunicationBaseUrl}sms/send",
          new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json")
        );

        if (((int)response.StatusCode) > 300) throw new Exception("errorWhileSentSMS");

        return response.IsSuccessStatusCode;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }
  }
}
