using Application.Service;
using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
using Serilog;
using System;
using System.Collections.Generic;

namespace WebApi.Controllers
{
    [Route("partner")]
    [ApiController]
    public class PartnerController : Controller
    {
        private readonly IPartnerService _service;
        private readonly Serilog.ILogger _logger;
        public PartnerController(IPartnerService service, Serilog.ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar um parceiro
        /// </summary>
        /// <returns>Valida os dados passados para criação do parceiro e retorna os dados cadastrados</returns>
        [Authorize]
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Partner>> Create(CreatePartnerRequest partnerRequest)
        {
            if (string.IsNullOrEmpty(partnerRequest.Email))
                return BadRequest(new Response<Partner>() { Status = 400, Message = "E-mail não informado", Success = false });

            if (string.IsNullOrEmpty(partnerRequest.Legal_name))
                return BadRequest(new Response<Partner>() { Status = 400, Message = "Nome não informado", Success = false });

            try
            {
                var response = _service.Create(partnerRequest);
                return StatusCode(StatusCodes.Status201Created, new Response<Partner>() { Status = 201, Message = $"Parceiro registrado com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Partner>() { Status = 400, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Partner>() { Status = 400, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Partner>() { Status = 400, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    case "partnerAlreadyCreatedEmail":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Partner>() { Status = 400, Message = $"Parceiro já cadastrado na base de dados com o email informado.", Success = false });
                    case "partnerAlreadyCreatedDocument":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Partner>() { Status = 400, Message = $"Parceiro já cadastrado na base de dados com o documento informado.", Success = false });
                    case "partnerNotCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Partner>() { Status = 400, Message = $"Parceiro inexistente na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<Partner>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por atualizar o cadastro de um parceiro
        /// </summary>
        /// <returns>Retorna o objeto que representa o parceiro em caso de sucesso</returns>
        [Authorize]
        [HttpPut("update")]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Partner>> Update(UpdatePartnerRequest partner)
        {

            var token = Request.Headers["Authorization"];
            try
            {
                var response = _service.Update(partner, token);

                if (response != null)
                {
                    _logger.Information($"Parceiro atualizado com sucesso.");
                    return StatusCode(StatusCodes.Status200OK, new Response<Partner>() { Status = 200, Message = $"Parceiro atualizado com sucesso", Data = response,  Success = true });
                }
                else
                {
                    _logger.Warning($"Não foi possível atualizar o Parceiro.");
                    return BadRequest(new Response<Partner>() { Status = 400, Message = $"Não foi possível atualizar o Parceiro.", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 403, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por inativar uma lista de parceiro
        /// </summary>
        /// <returns>Retorna a lista de parceiros inativos</returns>
        [Authorize]
        [HttpPut("massinactive")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> MassInactive(List<Guid> id)
        {
            try
            {
                var response = _service.MassInactive(id);

                if (response == true)
                {
                    _logger.Information($"Parceiros inativados com sucesso.");
                    return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Parceiros inativados com sucesso", Success = true });
                }
                else
                {
                    _logger.Warning($"Não foi possível inativar o Parceiro.");
                    return BadRequest(new Response<bool>() { Status = 400, Message = $"Não foi possível atualizar o Parceiro.", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 403, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por excluir o cadastro de um ou mais parceiros
        /// </summary>
        /// <returns>Retorna o objeto que representa o parceiro excluído em caso de sucesso</returns>
        [Authorize]
        [HttpDelete("delete")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> Delete(List<Guid> id)
        {
            try
            {
                var response = _service.Delete(id);
                if (response == true)
                {
                    _logger.Information("Parceiro(s) deletados com sucesso!");
                    return Ok(new Response<Partner>() { Status = 200, Message = "Parceiro(s) deletados com sucesso!", Success = true });
                }
                else
                {
                    _logger.Information("Erro ao deletar parceiros!");
                    return Unauthorized(new Response<Partner>() { Status = 401, Message = "Erro ao deletar parceiro(s)!", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while deleting partners!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 403, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por retornar lista de parceiros cadastrados
        /// </summary>
        /// <returns>Em caso de sucesso, irá listar os parceiros cadastrados</returns>
        [Authorize]
        [HttpGet("")]
        [ProducesResponseType(typeof(Response<ListPartnerResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ListPartnerResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ListPartnerResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ListPartnerResponse>> GetPartners(string filter, int? page, int? itensPerPage)
        {
            try
            {
                var filters = new Filter
                {
                    page = page ?? 1,
                    itensPerPage = itensPerPage ?? 5,
                    filter = filter
                };

                var getPartnersResponse = _service.GetPartners(filters);
                if (getPartnersResponse.Partners.Count > 0)
                {
                    _logger.Information("Parceiros listado com sucesso!");
                    return Ok(new Response<ListPartnerResponse>() { Status = 200, Message = "Parceiro listado com sucesso!", Data = getPartnersResponse, Success = true });
                }
                else
                {
                    _logger.Information("Parceiro não encontrado no sistema!");
                    return Unauthorized(new Response<ListPartnerResponse>() { Status = 401, Message = "Parceiro não encontrado no sistema!", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<ListPartnerResponse>() { Status = 304, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<ListPartnerResponse>() { Status = 304, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ListPartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por retornar um parceiro a partir do partner_id
        /// </summary>
        /// <returns>Em caso de sucesso, irá listar o parceiro do Id informado</returns>
        [Authorize]
        [HttpGet("{partner_id}")]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Partner>> GetPartnerById(Guid partner_id)
        {
            try
            {
                var getPartnerByIdResponse = _service.GetPartnerById(partner_id);
                
                    _logger.Information("Parceiro listado com sucesso!");
                    return Ok(new Response<Partner>() { Status = 200, Message = "Parceiro listado com sucesso!", Data = getPartnerByIdResponse, Success = true });
               
              
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 403, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "partnerNotCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 403, Message = $"Erro ao consultar Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por retornar um parceiro a partir do user_id
        /// </summary>
        /// <returns>Em caso de sucesso, irá listar o parceiro do Id informado</returns>
        [Authorize]
        [HttpGet("partnerby/{user_id}")]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Partner>> GetPartnerByUser_id(Guid user_id)
        {
            try
            {
                var getPartnerByIdResponse = _service.GetPartnerByUserId(user_id);
                if (getPartnerByIdResponse.Partner_id != Guid.Empty)
                {
                    _logger.Information("Parceiro listado com sucesso!");
                    return Ok(new Response<Partner>() { Status = 200, Message = "Parceiro listado com sucesso!", Data = getPartnerByIdResponse, Success = true });
                }
                else
                {
                    _logger.Information("Parceiro não encontrado no sistema!");
                    return BadRequest(new Response<Partner>() { Status = 400, Message = "Parceiro não encontrado no sistema!", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "partnerNotCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Erro ao consultar Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por retornar um parceiro a partir do admin_id
        /// </summary>
        /// <returns>Em caso de sucesso, irá listar o parceiro do Id informado</returns>
        [Authorize]
        [HttpGet("admin/{admin_id}")]
        [ProducesResponseType(typeof(Response<Partner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Partner>> GetPartnerByAdmin_id(Guid admin_id, string filter, int? page, int? itensPerPage)
        {
            try
            {
                var filters = new Filter
                {
                    page = page ?? 1,
                    itensPerPage = itensPerPage ?? 5,
                    filter = filter
                };

                var getPartnerByIdResponse = _service.GetPartnerByAdminId(admin_id, filters);
                if (getPartnerByIdResponse.Partner_id != Guid.Empty)
                {
                    _logger.Information("Parceiro listado com sucesso!");
                    return Ok(new Response<Partner>() { Status = 200, Message = "Parceiro listado com sucesso!", Data = getPartnerByIdResponse, Success = true });
                }
                else
                {
                    _logger.Information("Parceiro não encontrado no sistema!");
                    return BadRequest(new Response<Partner>() { Status = 400, Message = "Parceiro não encontrado no sistema!", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "partnerNotCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Erro ao consultar Parceiro.", Success = false });
                    case "errorWhileInsertPartnerOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Não foi possível registrar parceiro. Erro no processo de inserção do parceiro na base de dados.", Success = false });
                    case "errorWhileDeletePartnerOnDB":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Não foi possível deletar o parceiro. Erro no processo de deleção do parceiro na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }
    }
}
