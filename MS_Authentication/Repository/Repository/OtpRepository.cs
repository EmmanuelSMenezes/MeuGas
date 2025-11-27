using System;
using System.Linq;
using Dapper;
using Domain.Model;
using Npgsql;
using Serilog;

namespace Infrastructure.Repository
{
  public class OtpRepository : IOtpRepository
  {
    private readonly string _connectionString;
    private readonly string _otpValidationMinutes;
    private readonly ILogger _logger;
    public OtpRepository(string connectionString, string otpValidationMinutes,ILogger logger)
    {
      _connectionString = connectionString;
      _otpValidationMinutes = otpValidationMinutes;
      _logger = logger;
    }

    public OTP CreateOtp(Guid user_id, string generatedOtp, OtpType Type)
    {
      try
      {
        string sql = $@"INSERT INTO authentication.otp
                      (user_id, otp, expiry, type)
                      VALUES('{user_id}', '{generatedOtp}', current_timestamp + interval '{_otpValidationMinutes} minutes', {((int)Type)}) RETURNING *;";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var response = connection.Query<OTP>(sql).FirstOrDefault();
          _logger.Information("[OtpRepoitory - CreateOtp]: Otp created succesfully on database.");
          return response;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[OtpRepoitory - CreateOtp]: Error while create otp on database.");
        throw ex;
      }
    }

    public OTP GetOTP(Guid user_id)
    {
      try
      {
        string sql = $"select * FROM authentication.otp where user_id = '{user_id}' and used = false order by created_at desc limit 1;";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var response = connection.Query<OTP>(sql).FirstOrDefault();
          _logger.Information("[OtpRepoitory - GetOTP]: Otp retrieved succesfully on database.");
          return response;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[OtpRepoitory - GetOTP]: Error while retrieve otp on database.");
        throw ex;
      }
    }

    public OTP UpdateOTP(OTP otp)
    {
      try
      {
        string sql = $@"UPDATE authentication.otp SET used={otp.used}, updated_at=CURRENT_TIMESTAMP WHERE otp_id = '{otp.Otp_id}' and user_id = '{otp.User_id}' RETURNING *;";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var response = connection.Query<OTP>(sql).FirstOrDefault();
          _logger.Information("[OtpRepoitory - UpdateOTP]: Otp updated succesfully on database.");
          return response;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[OtpRepoitory - UpdateOTP]: Error while update otp on database.");
        throw ex;
      }
    }
  }
}
