using Application.Service;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("settings")]
    [ApiController]
    [Authorize]
    public class SettingController : Controller
    {
        private readonly ISettingsService _service;
        private readonly ILogger _logger;

        public SettingController(ISettingsService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar taxa padrão do Administrador.
        /// </summary>
        /// <returns>Valida os dados passados para criação da taxa e retorna os dados criado.</returns>

        [HttpPost("fee/create")]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<RateSettingsResponse>> CreateRateSettings([FromBody] CreatedRateSettingsRequest createdRateSettingsRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.CreatedRateSettingsService(createdRateSettingsRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<RateSettingsResponse>() { Status = 200, Message = $"Taxas configurada com sucesso", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new rate settings!");
                switch (ex.Message)
                {
                    case "ExistingRate":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<RateSettingsResponse>() { Status = 403, Message = $"Taxas já registrada para esse administrador!", Success = false, Error = ex.Message });
                    case "ErrorDecodingToken":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<RateSettingsResponse>() { Status = 403, Message = $"Não foi possível alterar taxa. Erro no processo de decodificação do token!", Success = false, Error = ex.Message });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<RateSettingsResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por alterar taxa padrão do Administrador.
        /// </summary>
        /// <returns>Valida os dados passados para alteração das taxas e retorna os dados alterado.</returns>

        [HttpPut("fee/update")]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<RateSettingsResponse>> UpdateRateSettings([FromBody] UpdatedRateSettingsRequest updatedRateSettingsRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.UpdatedRateSettingsService(updatedRateSettingsRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<RateSettingsResponse>() { Status = 200, Message = $"Taxas alterada com sucesso", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while updating rate settings!");
                switch (ex.Message)
                {
                    case "ExistingRate":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<RateSettingsResponse>() { Status = 403, Message = $"Taxas já registrada para esse administrador!", Success = false, Error = ex.Message });
                    case "ErrorDecodingToken":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<RateSettingsResponse>() { Status = 403, Message = $"Não foi possível alterar taxa. Erro no processo de decodificação do token!", Success = false, Error = ex.Message });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<RateSettingsResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por buscar taxa padrão do Administrador.
        /// </summary>
        /// <returns>Valida os dados passados e retorna a taxa padrão.</returns>

        [HttpGet("fee/get/admin/{admin_id}")]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<RateSettingsResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<RateSettingsResponse>> GetRateSettings([Required(ErrorMessage = "Informe o id do administrador")] Guid admin_id)
        {
            try
            {

                var response = _service.GetRateSettingsAdminService(admin_id);
                return StatusCode(StatusCodes.Status200OK, new Response<RateSettingsResponse>() { Status = 200, Message = $"Taxas retornada com sucesso", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while retrieved rate settings!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<RateSettingsResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por criar registro do estilo da plataforma do parceiro.
        /// </summary>
        /// <returns>Valida os dados passados e retorna o estilo registrado.</returns>

        [HttpPost("style/create")]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Task<StylePartnerResponse>>> CreateStyleSettings([FromForm] CreateStyleRequest styleRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.CreateStylePartnerService(styleRequest, token);
                return StatusCode(StatusCodes.Status201Created, new Response<Task<StylePartnerResponse>>() { Status = 200, Message = $"Style da plataforma registrado com sucesso!", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating style settings!");
                switch (ex.Message)
                {
                    case "ErrorDecodingToken":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Task<StylePartnerResponse>>() { Status = 403, Message = $"Não foi possível registrar estilo. Erro no processo de decodificação do token!", Success = false, Error = ex.Message });
                    case "failedWhileUpdateImage":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Task<StylePartnerResponse>>() { Status = 403, Message = $"Não foi possível registrar estilo. Erro ao realizar upload do logo!", Success = false, Error = ex.Message });
                    case "ExistingStyle":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Task<StylePartnerResponse>>() { Status = 403, Message = $"Não foi possível registrar estilo. Já existe configuração para esse administrador!", Success = false, Error = ex.Message });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<Task<StylePartnerResponse>>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por buscar estilo da plataforma do parceiro.
        /// </summary>
        /// <returns>Valida os dados passados e retorna o estilo da plataforma.</returns>

        [HttpGet("style/get/admin/{admin_id}")]
        [ProducesResponseType(typeof(Response<StylePartnerResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<StylePartnerResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<StylePartnerResponse>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<StylePartnerResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<StylePartnerResponse>> GetStyleSettings([Required(ErrorMessage = "Informe o id do administrador")] Guid admin_id)
        {
            try
            {
                var response = _service.GetStylePartnerService(admin_id);
                return StatusCode(StatusCodes.Status200OK, new Response<StylePartnerResponse>() { Status = 200, Message = $"Estilo da plataforma do parceiro retornado com sucesso!", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while searching style settings!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<StylePartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }
        /// <summary>
        /// Endpoint responsável por alterar estilo da plataforma do parceiro.
        /// </summary>
        /// <returns>Valida os dados passados e retorna estilo alterado.</returns>

        [HttpPut("style/update")]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<Task<StylePartnerResponse>>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Task<StylePartnerResponse>>> UpdateStyleSettings([FromForm] UpdateStyleRequest styleRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.UpdateStylePartnerService(styleRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<Task<StylePartnerResponse>>() { Status = 200, Message = $"Estilo da plataforma do parceiro alterado com sucesso!", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while updating style settings!");
                switch (ex.Message)
                {
                    case "ErrorDecodingToken":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Task<StylePartnerResponse>>() { Status = 403, Message = $"Não foi possível alterar estilo. Erro no processo de decodificação do token!", Success = false, Error = ex.Message });
                    case "failedWhileUpdateImage":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Task<StylePartnerResponse>>() { Status = 403, Message = $"Não foi possível alterar estilo. Erro ao realizar upload do logo!", Success = false, Error = ex.Message });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<Task<StylePartnerResponse>>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por buscar estilo do app.
        /// </summary>
        /// <returns>Valida os dados passados e retorna o estilo do app.</returns>
        [AllowAnonymous]
        [HttpGet("styleapp/get/")]
        [ProducesResponseType(typeof(Response<StyleConsumerResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<StyleConsumerResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<StyleConsumerResponse>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<StyleConsumerResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<StylePartnerResponse>> GetStyleAppSettings()
        {
            try
            {
                var response = _service.GetStyleConsumerService();
                return StatusCode(StatusCodes.Status200OK, new Response<StyleConsumerResponse>() { Status = 200, Message = $"Estilo da aplicativo retornado com sucesso!", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while searching style app settings!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<StyleConsumerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }
    }
}
