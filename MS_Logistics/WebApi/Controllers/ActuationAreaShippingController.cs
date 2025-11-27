using Application.Service;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("actuation-area-shipping")]
    [ApiController]
    [Authorize]
    public class ActuationAreaShippingController : Controller
    {
        private readonly IActuationAreaService _service;
        private readonly ILogger _logger;
        public ActuationAreaShippingController(IActuationAreaService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por configurar area de atuação.
        /// </summary>
        /// <returns>Valida os dados passados e retorna os dados vinculados.</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<ActuationAreaShippingResponse>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Response<ActuationAreaShippingResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ActuationAreaShippingResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ActuationAreaShippingResponse>> CreateNewActuationArea([FromBody] CreateActuationAreaShippingRequest createActuationAreaShippingRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.CreateActuationAreaShippingOptions(createActuationAreaShippingRequest, token);
                return StatusCode(StatusCodes.Status201Created, new Response<ActuationAreaShippingResponse>() { Status = 201, Message = $"Configuração da área de atuação criada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new shipping options actuation area!");
                switch (ex.Message)
                {
                    case "UserNotExists":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<ActuationAreaShippingResponse>() { Status = 403, Message = $"Não foi possível configurar área de atuação. Usuário não existente", Success = false, Error = ex.ToString() });
                    case "AreaConfExists":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<ActuationAreaShippingResponse>() { Status = 403, Message = $"Não foi possível configurar área de atuação. Área já configurada!", Success = false, Error = ex.ToString() });

                    case "errorWhileInsertShippingOptionsOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<ActuationAreaShippingResponse>() { Status = 400, Message = $"Não foi possível configurar área de atuação. Erro no processo de inserção na base de dados.", Success = false, Error = ex.Message });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ActuationAreaShippingResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por listar as opções de frete para vincular à area de atuação.
        /// </summary>
        /// <returns>Valida os dados passados e retorna os dados.</returns>
        [HttpGet()]
        [ProducesResponseType(typeof(Response<List<DeliveryOption>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<List<DeliveryOption>>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<List<DeliveryOption>>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<List<DeliveryOption>>> GetActuationAreaDeliveryOption()
        {
            try
            {
                var response = _service.GetActuationAreaDeliveryOption();
                return StatusCode(StatusCodes.Status200OK, new Response<List<DeliveryOption>>() { Status = 200, Message = $"Lista de opção de entrega retornada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while listing delivery options in actuation area!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<List<DeliveryOption>>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por alterar configurações da area de atuação.
        /// </summary>
        /// <returns>Valida os dados passados e retorna os dados alterados.</returns>
        [HttpPut("Update")]
        [ProducesResponseType(typeof(Response<ActuationAreaShippingResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ActuationAreaShippingResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ActuationAreaShippingResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ActuationAreaShippingResponse>> UpdateConfigActuationArea([FromBody] UpdateActuationAreaShippingRequest updateActuationAreaShippingRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.UpdateActuationAreaShippingOptions(updateActuationAreaShippingRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<ActuationAreaShippingResponse>() { Status = 200, Message = $"Configuração da área de atuação alterada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new shipping options actuation area!");
                switch (ex.Message)
                {
                    case "errorWhileUpdateShippingOptionsOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<ActuationAreaShippingResponse>() { Status = 400, Message = $"Não foi possível alterar as configurações da area de atuação. Erro no processo de alteração na base de dados.", Success = false, Error = ex.Message });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ActuationAreaShippingResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }


    }
}

