using Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using Application.Service;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
  [Authorize]
  [Route("otp")]
  [ApiController]
  public class OTPController : Controller
  {
    public readonly IOtpService _otpService;
    private readonly ILogger _logger;
    public OTPController(
      IOtpService otpService,
      ILogger logger
    )
    {
      _otpService = otpService;
      _logger = logger;
    }
    /// <summary>
    /// Endpoint responsável por retornar se o Microserviço está ativo.
    /// </summary>
    /// <returns>Retorna "true" caso o microserviço esteja ativo.</returns>
    ///
    [HttpPost("sms/send")]
    [ProducesResponseType(typeof(Response<OneTimePassword>), StatusCodes.Status200OK)]
    public ActionResult<Response<OneTimePassword>> SendOTPSMS()
    {
      try
      {
        var token = Request.Headers["Authorization"];
        var response = _otpService.SendOtpConfirmation(token);
        return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"OTP enviado com sucesso.", Data = true, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while creating new otp code!");
        switch (ex.Message)
        {
          case "SMSNotSended":
            return StatusCode(StatusCodes.Status403Forbidden, new Response<CreateSessionResponse>() { Status = 403, Message = $"Não foi possível enviar sms com o código otp.", Success = false, Error = ex.ToString() });
          case "createOtpNotSuccefully":
            return StatusCode(StatusCodes.Status304NotModified, new Response<CreateSessionResponse>() { Status = 304, Message = $"Não foi possível criar otp. tente novamente", Success = false, Error = ex.ToString()  });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateSessionResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString()  });
        }   
      }
    }

    /// <summary>
    /// Endpoint responsável por enviar OTP para login/registro.
    /// </summary>
    /// <returns>Retorna "true" caso o OTP seja enviado com sucesso.</returns>
    ///
    [HttpPost("send-login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    public async Task<ActionResult<Response<bool>>> SendOTPLogin([FromBody] SendOTPLoginRequest request)
    {
      try
      {
        var response = await _otpService.SendOtpLogin(request.Phone, request.Name);
        return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"OTP enviado com sucesso.", Data = true, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while sending OTP for login!");
        switch (ex.Message)
        {
          case "SMSNotSended":
            return StatusCode(StatusCodes.Status403Forbidden, new Response<bool>() { Status = 403, Message = $"Não foi possível enviar SMS com o código OTP.", Success = false, Error = ex.ToString() });
          case "createOtpNotSuccefully":
            return StatusCode(StatusCodes.Status304NotModified, new Response<bool>() { Status = 304, Message = $"Não foi possível criar OTP. Tente novamente.", Success = false, Error = ex.ToString() });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Erro inesperado ao enviar OTP.", Success = false, Error = ex.ToString() });
        }
      }
    }

    /// <summary>
    /// Endpoint responsável por verificar OTP e fazer login/registro.
    /// </summary>
    /// <returns>Retorna token de autenticação.</returns>
    ///
    [HttpPost("verify-login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(Response<CreateSessionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<Response<CreateSessionResponse>>> VerifyOTPLogin([FromBody] VerifyOTPLoginRequest request)
    {
      try
      {
        var response = await _otpService.VerifyOtpLogin(request.OtpCode, request.Phone, request.Name);
        return StatusCode(StatusCodes.Status200OK, new Response<CreateSessionResponse>() { Status = 200, Message = $"Login realizado com sucesso.", Data = response, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while verifying OTP for login!");
        switch (ex.Message)
        {
          case "otpNotRegistered":
            return StatusCode(StatusCodes.Status404NotFound, new Response<CreateSessionResponse>() { Status = 404, Message = $"Código OTP não encontrado.", Success = false, Error = ex.ToString() });
          case "unauthorized":
            return StatusCode(StatusCodes.Status401Unauthorized, new Response<CreateSessionResponse>() { Status = 401, Message = $"Código OTP inválido ou expirado.", Success = false, Error = ex.ToString() });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateSessionResponse>() { Status = 500, Message = $"Erro inesperado ao verificar OTP.", Success = false, Error = ex.ToString() });
        }
      }
    }

    /// <summary>
    /// Endpoint responsável por retornar se o Microserviço está ativo.
    /// </summary>
    /// <returns>Retorna "true" caso o microserviço esteja ativo.</returns>
    ///
    [HttpPost("sms/send/forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(Response<OneTimePassword>), StatusCodes.Status200OK)]
    public async Task< ActionResult<Response<OneTimePassword>>> SendOTPSMSForgotPassword([FromQuery] string phone_number)
    {
      try
      {
        var response = await _otpService.SendOtpForgotPassword(phone_number);
               
        return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"OTP enviado com sucesso.", Data = true, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while creating new otp code!");
        switch (ex.Message)
        {
          case "SMSNotSended":
            return StatusCode(StatusCodes.Status403Forbidden, new Response<CreateSessionResponse>() { Status = 403, Message = $"Não foi possível enviar sms com o código otp.", Success = false, Error = ex.ToString()  });
          case "userNotExists":
            return StatusCode(StatusCodes.Status404NotFound, new Response<CreateSessionResponse>() { Status = 404, Message = $"Não foi possível enviar sms com o código otp, usuário não encontrado.", Success = false, Error = ex.ToString()  });
          case "createOtpNotSuccefully":
            return StatusCode(StatusCodes.Status304NotModified, new Response<CreateSessionResponse>() { Status = 304, Message = $"Não foi possível criar otp. tente novamente", Success = false, Error = ex.ToString()  });
          case "tokenNotCreated":
            return StatusCode(StatusCodes.Status412PreconditionFailed, new Response<CreateSessionResponse>() { Status = 412, Message = $"Não foi possível criar otp. tente novamente", Success = false, Error = ex.ToString()  });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateSessionResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString()  });
        }   
      }
    }

    /// <summary>
    /// Endpoint responsável por retornar se o Microserviço está ativo.
    /// </summary>
    /// <returns>Retorna "true" caso o microserviço esteja ativo.</returns>
    ///
    [HttpPost("verify")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    public ActionResult<Response<bool>> VerifyOTP([FromQuery] string otp_code)
    {
      try
      {
        var token = Request.Headers["Authorization"];
        var response = _otpService.VerifyOtpCode(otp_code, token);
        return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"OTP validado com sucesso.", Data = true, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while creating new otp code!");
        switch (ex.Message)
        {
          case "userNotExists":
            return StatusCode(StatusCodes.Status404NotFound, new Response<bool>() { Status = 404, Message = $"Não foi possível validar o código otp. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString()  });
          case "otpNotRegistered":
            return StatusCode(StatusCodes.Status404NotFound, new Response<bool>() { Status = 404, Message = $"Não foi possível validar o código otp. Usuário não tem otp cadastrada para o usuário atual.", Success = false, Error = ex.ToString()  });
          case "unauthorized":
            return StatusCode(StatusCodes.Status401Unauthorized, new Response<bool>() { Status = 401, Message = $"Não foi possível validar o código otp. Validação não autorizada.", Success = false, Error = ex.ToString()  });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString()  });
        }   
      }
    }

    /// <summary>
    /// Endpoint responsável por retornar se o Microserviço está ativo.
    /// </summary>
    /// <returns>Retorna "true" caso o microserviço esteja ativo.</returns>
    ///
    [HttpPost("verify/forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(Response<CreateSessionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<Response<CreateSessionResponse>>> VerifyOTPForgotPassword([FromQuery] string otp_code, string phone_number)
    {
      try
      {
        var response = await _otpService.VerifyOtpCodeForgotPassword(otp_code, phone_number);
        return StatusCode(StatusCodes.Status200OK, new Response<CreateSessionResponse>() { Status = 200, Message = $"OTP validado com sucesso.", Data = response, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while creating new otp code!");
        switch (ex.Message)
        {
          case "userNotExists":
            return StatusCode(StatusCodes.Status404NotFound, new Response<CreateSessionResponse>() { Status = 404, Message = $"Não foi possível validar o código otp. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString()  });
          case "otpNotRegistered":
            return StatusCode(StatusCodes.Status404NotFound, new Response<CreateSessionResponse>() { Status = 404, Message = $"Não foi possível validar o código otp. Usuário não tem otp cadastrada para o usuário atual.", Success = false, Error = ex.ToString()  });
          case "unauthorized":
            return StatusCode(StatusCodes.Status401Unauthorized, new Response<CreateSessionResponse>() { Status = 401, Message = $"Não foi possível validar o código otp. Validação não autorizada.", Success = false, Error = ex.ToString()  });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateSessionResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString()  });
        }   
      }
    }
  }
}
