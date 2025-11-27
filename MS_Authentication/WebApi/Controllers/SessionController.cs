using Application.Service;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
namespace WebApi.Controllers
{
  [Route("session")]
  [ApiController]
  public class SessionController : Controller
  {
    private readonly ISessionService _service;
    private readonly ILogger _logger;

    public SessionController(ISessionService service, ILogger logger) {
      _service = service;
      _logger = logger;
    }

    /// <summary>
    /// Endpoint responsável por criar uma sessão com os dados do usuário.
    /// </summary>
    /// <returns>Valida os dados passados para criação da sessão e retorna os dados do usuário com um token.</returns>
    [AllowAnonymous]
    [HttpPost("create")]
    [ProducesResponseType(typeof(Response<CreateSessionResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<CreateSessionResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Response<CreateSessionResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(Response<CreateSessionResponse>), StatusCodes.Status500InternalServerError)]
    public ActionResult<Response<CreateSessionResponse>> CreateSession([FromBody] CreateSessionRequest createSessionRequest)
    {
      try
      {
        var response = _service.CreateSessionService(createSessionRequest);
        return StatusCode(StatusCodes.Status200OK, new Response<CreateSessionResponse>() { Status = 200, Message = $"Usuário logado com sucesso", Data = response, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while creating new session!");
        switch (ex.Message)
        {
          case "userNotExists":
            return StatusCode(StatusCodes.Status403Forbidden, new Response<CreateSessionResponse>() { Status = 403, Message = $"Não foi possível criar sessão. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString()  });
          case "incorrectPassword":
            return StatusCode(StatusCodes.Status403Forbidden, new Response<CreateSessionResponse>() { Status = 403, Message = $"Não foi possível criar sessão. Email ou Senha incorreta.", Success = false, Error = ex.ToString()  });
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateSessionResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString()  });
        }   
      }
    }
  }
}
