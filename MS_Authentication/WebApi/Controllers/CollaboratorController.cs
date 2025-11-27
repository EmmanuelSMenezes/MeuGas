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
    [Route("collaborator")]
    [ApiController]
    public class CollaboratorController : Controller
    {
        private readonly ICollaboratorService _service;
        private readonly ILogger _logger;

        public CollaboratorController(ICollaboratorService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar uma sessão com os dados do usuário.
        /// </summary>
        /// <returns>Valida os dados passados para criação da sessão e retorna os dados do usuário com um token.</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<Collaborator>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<Collaborator>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Collaborator>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<Collaborator>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Response<Collaborator>>> CreateCollaborator([FromBody] CreateCollaboratorRequest createCollaboratorRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = await _service.CreateCollaborator(createCollaboratorRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<Collaborator>() { Status = 200, Message = $"Usuário logado com sucesso", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new session!");
                switch (ex.Message)
                {
                    case "userEmailAlreadyRegistered":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Collaborator>() { Status = 403, Message = $"Não foi possível criar Colaborador. Usuário já está cadastrado com e-mail informado", Success = false, Error = ex.ToString() });
                    case "userNotExists":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Collaborator>() { Status = 403, Message = $"Não foi possível criar sessão. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString() });
                    case "incorrectPassword":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<Collaborator>() { Status = 403, Message = $"Não foi possível criar sessão. Email ou Senha incorreta.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<Collaborator>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por criar uma sessão com os dados do usuário.
        /// </summary>
        /// <returns>Valida os dados passados para criação da sessão e retorna os dados do usuário com um token.</returns>
        [AllowAnonymous]
        [HttpGet("list")]
        [ProducesResponseType(typeof(Response<ListCollaborators>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<ListCollaborators>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<ListCollaborators>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<ListCollaborators>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<ListCollaborators>> ListCollaboratorsBySponsorId([FromQuery] Guid sponsor_id, int? page, int? itensPerPage, string filter)
        {
            try
            {
                var pagination = new FilterCollaborator()
                {
                    ItensPerPage = (int)itensPerPage,
                    Page = (int)page,
                    Filter = filter,
                };
                var response = _service.ListCollaboratorsBySponsorId(pagination, sponsor_id);
                return StatusCode(StatusCodes.Status200OK, new Response<ListCollaborators>() { Status = 200, Message = $"Usuário logado com sucesso", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new session!");
                switch (ex.Message)
                {
                    case "userNotExists":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<ListCollaborators>() { Status = 403, Message = $"Não foi possível criar sessão. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString() });
                    case "incorrectPassword":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<ListCollaborators>() { Status = 403, Message = $"Não foi possível criar sessão. Email ou Senha incorreta.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<ListCollaborators>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }


        /// <summary>
        /// Endpoint responsável por criar uma sessão com os dados do usuário.
        /// </summary>
        /// <returns>Valida os dados passados para criação da sessão e retorna os dados do usuário com um token.</returns>
        [HttpDelete("delete")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> Delete([FromBody] List<Guid> ids)
        {
            try
            {
                var response = _service.DeleteCollaborator(ids);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Usuário logado com sucesso", Data = true, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new session!");
                switch (ex.Message)
                {
                    case "userNotExists":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<bool>() { Status = 403, Message = $"Não foi possível criar sessão. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString() });
                    case "incorrectPassword":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<bool>() { Status = 403, Message = $"Não foi possível criar sessão. Email ou Senha incorreta.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }


        /// <summary>
        /// Endpoint responsável por criar uma sessão com os dados do usuário.
        /// </summary>
        /// <returns>Valida os dados passados para criação da sessão e retorna os dados do usuário com um token.</returns>
        [HttpPut("update")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> Update([FromBody] List<UpdateCollaboratorRequest> list)
        {
            try
            {
                var response = _service.UpdateCollaborator(list);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Usuário logado com sucesso", Data = true, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new session!");
                switch (ex.Message)
                {
                    case "userNotExists":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<bool>() { Status = 403, Message = $"Não foi possível criar sessão. Usuário não está cadastrado com e-mail ou numero de telefone informado", Success = false, Error = ex.ToString() });
                    case "incorrectPassword":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<bool>() { Status = 403, Message = $"Não foi possível criar sessão. Email ou Senha incorreta.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }
    }
}
