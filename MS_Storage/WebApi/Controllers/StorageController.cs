using Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Serilog;
using System;
using Application.Service;

namespace WebApi.Controllers
{
  [Route("storage")]
  [ApiController]
  public class StorageController : Controller
  {
    private readonly IStorageService _service;
    private readonly ILogger _logger;

    public StorageController(
        IStorageService service,
        ILogger logger
        )
    {
      _service = service;
      _logger = logger;
    }

    /// <summary>
    /// Endpoint responsável por criar uma sessão com os dados do usuário.
    /// </summary>
    /// <returns>Valida os dados passados para criação da sessão e retorna os dados do usuário com um token.</returns>
    [Authorize]
    [HttpPost("upload")]
    [ProducesResponseType(typeof(Response<UploadFileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<UploadFileResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Response<UploadFileResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(Response<UploadFileResponse>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Response<UploadFileResponse>>> UploadFileAsync([FromForm] UploadFileRequest uploadFileRequest)
    {
      try
      {
        var response = await _service.UploadFileService(uploadFileRequest);
        return StatusCode(StatusCodes.Status200OK, new Response<UploadFileResponse>() { Status = 200, Message = $"Upload realizado com sucesso.", Data = response, Success = true });
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "Exception while creating new session!");
        switch (ex.Message)
        {
          default:
            return StatusCode(StatusCodes.Status500InternalServerError, new Response<UploadFileResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
        }
      }
    }
  }
}
