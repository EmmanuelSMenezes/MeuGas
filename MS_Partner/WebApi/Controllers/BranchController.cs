using Application.Service;
using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Operations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Collections.Generic;

namespace WebApi.Controllers
{
    [Route("branch")]
    [ApiController]
    [Authorize]
    public class BranchController : Controller
    {
        private readonly IBranchService _service;
        private readonly Serilog.ILogger _logger;
        public BranchController(IBranchService service, Serilog.ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar uma unidade
        /// </summary>
        /// <returns>Valida os dados passados para criação da unidade e retorna os dados cadastrados</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Branch>> Create(CreateBranchRequest branchRequest)
        {
            if (string.IsNullOrEmpty(branchRequest.Branch_name))
                return BadRequest(new Response<Branch>() { Status = 400, Message = "Nome não informado", Success = false });

            if (string.IsNullOrEmpty(branchRequest.Document))
                return BadRequest(new Response<Branch>() { Status = 400, Message = "Documento não informado", Success = false });

            try
            {
                var response = _service.Create(branchRequest);
                return StatusCode(StatusCodes.Status201Created, new Response<Branch>() { Status = 201, Message = $"unidade registrada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new branch!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Branch>() { Status = 403, Message = $"Erro ao cadastrar nova Unidade.", Success = false });
                    case "branchAlreadyCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Branch>() { Status = 400, Message = $"Unidade já cadastrada na base de dados.", Success = false });
                    case "branchNotCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<Branch>() { Status = 400, Message = $"Unidade inexistente na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<Branch>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por atualizar uma unidade
        /// </summary>
        /// <returns>Valida os dados passados para atualização da unidade e retorna os dados cadastrados</returns>
        [HttpPut("update")]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<Branch>> Update(Branch branch)
        {
            if (branch.Branch_id == Guid.Empty)
                return BadRequest(new Response<Branch>() { Status = 400, Message = "Id não informado", Success = false });

            try
            {
                var response = _service.Update(branch);

                if (response != null)
                {
                    _logger.Information($"Unidade atualizada com sucesso.");
                    return StatusCode(StatusCodes.Status200OK, new Response<Branch>() { Status = 200, Message = $"Unidade atualizada com sucesso.", Data = response, Success = true });
                }
                else
                {
                    _logger.Warning($"Não foi possível atualizar a unidade.");
                    return BadRequest(new Response<Branch>() { Status = 400, Message = $"Não foi possível atualizar a unidade.", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while updating branch!");
                switch (ex.Message)
                {
                    case "errorUpdate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<BranchResponse>() { Status = 403, Message = $"Erro ao atualizar Unidade.", Success = false });
                    case "branchAlreadyCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<BranchResponse>() { Status = 400, Message = $"Unidade já cadastrada na base de dados.", Success = false });
                    case "branchNotCreated":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<BranchResponse>() { Status = 400, Message = $"Unidade inexistente na base de dados.", Success = false });
                    case "errorWhileUpdateBranchOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<BranchResponse>() { Status = 304, Message = $"Não foi possível atualizar a unidade na base de dados.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<BranchResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por excluir o cadastro de um ou mais unidades
        /// </summary>
        /// <returns>Retorna o objeto que representa a unidade excluída em caso de sucesso</returns>
        
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
                    _logger.Information("Unidade(s) deletada(s) com sucesso!");
                    return Ok(new Response<Partner>() { Status = 200, Message = "Unidade(s) deletada(s) com sucesso!", Success = true });
                }
                else
                {
                    _logger.Information("Erro ao deletar unidade(s)!");
                    return Unauthorized(new Response<Partner>() { Status = 401, Message = "Erro ao deletar unidade(s)!", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while deleting branchs!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 403, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "errorWhileDeleteBranchOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<PartnerResponse>() { Status = 304, Message = $"Não foi possível deletar unidade(s).", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por retornar lista de unidades cadastradas
        /// </summary>
        /// <returns>Em caso de sucesso, irá listar as unidades cadastradas</returns>
        [HttpGet("")]
        [ProducesResponseType(typeof(Response<Branch>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<List<Branch>>> GetBranchs()
        {
            try
            {
                var getBranchsResponse = _service.GetBranchs();
                if (getBranchsResponse.Count > 0)
                {
                    _logger.Information("Unidades listada com sucesso!");
                    return Ok(new Response<List<Branch>>() { Status = 200, Message = "Unidades listada com sucesso!", Data = getBranchsResponse, Success = true });
                }
                {
                    _logger.Information("Unidade não encontrada no sistema!");
                    return Unauthorized(new Response<List<Branch>>() { Status = 401, Message = "Unidade não encontrada no sistema!", Success = false });
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while consulting Branch!");
                switch (ex.Message)
                {
                    case "errorCreate":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Erro ao cadastrar novo Parceiro.", Success = false });
                    case "errorGetBranchs":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<PartnerResponse>() { Status = 400, Message = $"Não foi possível listar as unidades.", Success = false });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por listar unidades do parceiro fornecido.
        /// </summary>
        /// <returns>Retorna lista com todas unidades cadastradas.</returns>
        [HttpGet("{partner_id}")]
        [ProducesResponseType(typeof(Response<List<ListBranchResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<List<ListBranchResponse>>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<List<ListBranchResponse>>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> GetBranchByPartner_id(Guid partner_id, string filter, int? page, int? itensPerPage)
        {
            try
            {
                var filters = new Filter
                {
                    page = page ?? 1,
                    itensPerPage = itensPerPage ?? 5,
                    filter = filter
                };

                var response = _service.ListBranchsByPartnerId(partner_id, filters);

                return StatusCode(StatusCodes.Status200OK, new Response<ListBranchResponse>() { Status = 200, Message = $"Unidades retornadas com sucesso.", Data = response, Success = true });

            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while deleting branchs!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<PartnerResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por detalhes da unidades fornecida.
        /// </summary>
        /// <returns>Retorna detallhes da unidade cadastradas.</returns>
        [HttpGet("details/{branch_id}")]
        [ProducesResponseType(typeof(Response<DetailsBranch>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<DetailsBranch>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<DetailsBranch>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<DetailsBranch>> GetDetailsBranch(Guid branch_id, string filter, int? page, int? itensPerPage)
        {
            try
            {
                var filters = new Filter
                {
                    page = page ?? 1,
                    itensPerPage = itensPerPage ?? 5,
                    filter = filter
                };

                var response = _service.ListDetailsBranch(branch_id, filters);

                return StatusCode(StatusCodes.Status200OK, new Response<DetailsBranch>() { Status = 200, Message = $"Unidades retornadas com sucesso.", Data = response, Success = true });

            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while deleting branchs!");
                switch (ex.Message)
                {
                    case "errorListingDetailsBranch":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<DetailsBranch>() { Status = 400, Message = $"Erro ao buscar detalhes da unidade. Verifique unidade informada!", Success = false, Error = ex.Message });

                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<DetailsBranch>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.Message });
                }
            }
        }
    }
}
