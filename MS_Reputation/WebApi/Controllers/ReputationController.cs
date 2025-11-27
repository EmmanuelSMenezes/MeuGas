using Application.Service;
using Application.Service.Interfaces;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("rating")]
    [ApiController]
    public class ReputationController : Controller
    {
        private readonly IReputationProductService _service;
        private readonly ILogger _logger;
        public ReputationController(IReputationProductService service, ILogger logger) {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar uma avaliação.
        /// </summary>
        /// <returns>Valida os dados passados para criação da avaliação e retorna os dados cadastrado.</returns>
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<RatingResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<RatingResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<RatingResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<RatingResponse>> CreateNewRating([FromBody] CreateRatingRequest createRatingRequest)
        {
            try
            {
                var response = _service.CreateRating(createRatingRequest);
                return StatusCode(StatusCodes.Status201Created, new Response<RatingResponse>() { Status = 200, Message = $"Avaliação registrada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new rating!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<RatingResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por listar todas avaliações do parceiro.
        /// </summary>
        /// <returns>Retorna lista com todas avaliações cadastradas do parceiro.</returns>
        [HttpGet("get")]
        [ProducesResponseType(typeof(Response<List<RatingResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<List<RatingResponse>>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<List<RatingResponse>>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<List<RatingResponse>>> GetRatingPartnerId(Guid branch_id)
        {
            try
            {
                var response = _service.GetRating(branch_id);
                return StatusCode(StatusCodes.Status200OK, new Response<List<RatingResponse>>() { Status = 200, Message = $"Avaliações retornada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while listing ratings!");
                switch (ex.Message)
                {
                     default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<List<RatingResponse>>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por listar todas avaliações do parceiro.
        /// </summary>
        /// <returns>Retorna lista com todas avaliações cadastradas do parceiro.</returns>
        [HttpGet("byconsumer")]
        [ProducesResponseType(typeof(Response<RatingResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<RatingResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<RatingResponse>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<RatingResponse>> GetRatingBranchByConsumerId([Required] Guid branch_id, [Required] Guid user_id)
        {
            try
            {
                var response = _service.GetRatingBranchByConsumerId(branch_id, user_id);
                return StatusCode(StatusCodes.Status200OK, new Response<RatingResponse>() { Status = 200, Message = $"Avaliações retornada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while listing ratings!");
                switch (ex.Message)
                {
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<RatingResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false });
                }
            }
        }
    }
}

