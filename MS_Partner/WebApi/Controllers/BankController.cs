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
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;

namespace WebApi.Controllers
{

    [ApiController]
    public class BankController : Controller
    {
        private readonly IBankService _service;
        private readonly Serilog.ILogger _logger;
        public BankController(IBankService service, Serilog.ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar um dados banccário do parceiro
        /// </summary>
        /// <returns>Valida os dados passado para a criação, retornando mensagem de sucesso caso não haja erro, caso contrario retorna mensagem de erro</returns>
        [Authorize]
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<BankPartner>> CreateBank([FromBody] CreateBankRequest bankRequest)
        {
            try
            {

                var token = Request.Headers["Authorization"];
                var response = _service.CreateBank(bankRequest, token);
                return StatusCode(StatusCodes.Status201Created, new Response<BankPartner>() { Status = 201, Message = $"Dados bancário criado com suceso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[BankController - CreateBank]: Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "ErrorDecodingToken":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<BankPartner>() { Status = 400, Message = $"Não foi possível criar dados bancário, erro no processo de decodificação do token.", Success = false, Error = ex.ToString() });

                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<BankPartner>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }


        /// <summary>
        /// Endpoint responsável por buscar dados bancário do parceiro
        /// </summary>
        /// <returns>Valida os dados passados e retorna os dados cadastrados</returns>
        [Authorize]
        [HttpGet("partner_id")]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<BankPartner>> GetBankByPartner_id([Required(ErrorMessage = "Informe o id do parceiro")] Guid partner_id)
        {
            try
            {
                var response = _service.GetBankById(partner_id);
                return StatusCode(StatusCodes.Status200OK, new Response<BankPartner>() { Status = 200, Message = $"Dados bancário retornado com suceso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[BankController - GetBankById]: Exception while fetching data!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<BankPartner>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por alterar dados bancário do parceiro
        /// </summary>
        /// <returns>Valida os dados passado para a alteração, retornando mensagem de sucesso caso não haja erro, caso contrario retorna mensagem de erro</returns>
        [Authorize]
        [HttpPut("update")]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<BankPartner>> Update([FromBody] UpdateBankRequest bankRequest)
        {
            try
            {

                var token = Request.Headers["Authorization"];
                var response = _service.UpdateBank(bankRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<BankPartner>() { Status = 200, Message = $"Dados bancário alterado com suceso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new partner!");
                switch (ex.Message)
                {
                    case "ErrorDecodingToken":
                        return StatusCode(StatusCodes.Status400BadRequest, new Response<BankPartner>() { Status = 400, Message = $"Não foi possível alterar dados bancário, erro no processo de decodificação do token.", Success = false, Error = ex.ToString() });

                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<BankPartner>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }
        /// <summary>
        /// Endpoint responsável por excluir dados bancário do parceiro
        /// </summary>
        /// <returns>Valida os dados passados e retorna os dados cadastrados</returns>
        [Authorize]
        [HttpDelete("bank_details_id")]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<BankPartner>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<BankPartner>> DeleteBank([Required(ErrorMessage = "Informe o id dos dados bancário")] Guid bank_details_id)
        {
            try
            {
                var response = _service.DeleteBank(bank_details_id);
                return StatusCode(StatusCodes.Status200OK, new Response<BankPartner>() { Status = 200, Message = $"Dados bancário excluído com suceso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[BankController - DeleteBank]: Exception while deleting data!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<BankPartner>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }
    }
}
