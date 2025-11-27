using Application.Service;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Serilog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("actuation-area")]
    [ApiController]
    [Authorize]
    public class ActuationAreaController : Controller
    {
        private readonly IActuationAreaService _service;
        private readonly ILogger _logger;
        public ActuationAreaController(IActuationAreaService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar uma area de atuação.
        /// </summary>
        /// <returns>Valida os dados passados para criação da area de atuação e retorna os dados da area de atuação cadastrada.</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<CreateActuationAreaResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<CreateActuationAreaResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<CreateActuationAreaResponse>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<CreateActuationAreaResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<CreateActuationAreaResponse>> CreateNewActuationArea([FromBody] CreateActuationAreaRequest createActuationAreaRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.CreateActuationArea(createActuationAreaRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<CreateActuationAreaResponse>()
                {
                    Status = 200,
                    Message = $"Usuário registrado com sucesso.",
                    Data = new CreateActuationAreaResponse()
                    {
                        Features = new List<Feature<ActuationAreaProperties>>() {
            new Feature<ActuationAreaProperties>() {
              Geometry = response.Features[0].Geometry,
              Properties = new ActuationAreaProperties() {
                Active = response.Features[0].Properties.Active,
                Actuation_area_id = response.Features[0].Properties.Actuation_area_id,
                Created_at = response.Features[0].Properties.Created_at,
                Created_by = response.Features[0].Properties.Created_by,
                Name = response.Features[0].Properties.Name,
                Partner_id = response.Features[0].Properties.Partner_id,
                Branch_id = response.Features[0].Properties.Branch_id,
                Updated_at = response.Features[0].Properties.Updated_at,
                Updated_by = response.Features[0].Properties.Updated_by
              }
            }
          }
                    },
                    Success = true
                });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new actuation area!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateActuationAreaResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }


        /// <summary>
        /// Endpoint responsável por listar areas de atuação.
        /// </summary>
        /// <returns>Valida os dados passados para listagem das aréas de atuação baseado no id do parceiro.</returns>
        [HttpGet("getByPartnerId")]
        [ProducesResponseType(typeof(Response<ListActuationArea>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ListActuationArea>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ListActuationArea>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<ListActuationArea>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ListActuationArea>> GetActuationAreasByPartnerId([FromQuery] Guid partner_id, string? filter,int? page, int? itensPerPage)
        {
            try
            {
                var filters = new Filter()
                {
                    page = page ?? 1,
                    itensPerPage = itensPerPage ?? 5,
                    filter = filter 
                };
                var response = _service.GetActuationAreasByPartnerId(partner_id, filters);
                return StatusCode(StatusCodes.Status200OK, new Response<ListActuationArea>() { Status = 200, Message = $"Areas de atuação listadas com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while listing actuation areas!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ListActuationArea>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por listar uma area de atuação.
        /// </summary>
        /// <returns>Valida os dados passados para listagem da aréa de atuação baseado no id da area da atuação.</returns>
        [HttpGet("getByActuationAreaId")]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ActuationArea>> GetActuationAreaByActuationAreaId([FromQuery] Guid actuation_area_id)
        {
            try
            {
                var response = _service.GetActuationAreaByActuationAreaId(actuation_area_id);
                return StatusCode(StatusCodes.Status200OK, new Response<ActuationArea>() { Status = 200, Message = $"Areas de atuação listada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while listing actuation area!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ActuationArea>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por excluir areas de atuação.
        /// </summary>
        /// <returns>Valida os dados passados para exclusão das aréas de atuação baseado no id da area da atuação.</returns>
        [HttpDelete("delete")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> DeleteActuationArea([FromBody] List<Guid> ids)
        {
            try
            {
                var response = _service.DeleteActuationArea(ids);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Areas de atuação deletadas com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while deleting actuations areas!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por atualizar os dados de areas de atuação.
        /// </summary>
        /// <returns>Valida os dados passados para atualização das aréas de atuação baseado no id da area da atuação.</returns>
        [HttpPut("update")]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<ActuationArea>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ActuationArea>> UpdateActuationArea([FromBody] UpdateActuationAreaRequest updateActuationAreaRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.UpdateActuationArea(updateActuationAreaRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<ActuationArea>() { Status = 200, Message = $"Area de atuação atualizada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while updating actuation area!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ActuationArea>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por listar configuração da area de atuação.
        /// </summary>
        /// <returns>Valida os dados passados para listagem da configuração da aréa de atuação baseado no id da area da atuação.</returns>
        [HttpGet("getAreaConfigByActuationAreaId")]
        [ProducesResponseType(typeof(Response<ListActuationAreaConfig>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ListActuationAreaConfig>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ListActuationAreaConfig>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<ListActuationAreaConfig>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ListActuationAreaConfig>> GetActuationAreaConfigByActuationAreaId([FromQuery] Guid actuation_area_id)
        {
            try
            {
                var response = _service.GetActuationAreaConfigByActuationAreaId(actuation_area_id);
                return StatusCode(StatusCodes.Status200OK, new Response<ListActuationAreaConfig>() { Status = 200, Message = $"Configuração da Areas de atuação listada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while listing actuation area config!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ListActuationAreaConfig>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }
    }
}

