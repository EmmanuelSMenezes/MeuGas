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
    [Route("user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _service;
        private readonly ILogger _logger;
        public UserController(IUserService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsável por criar um usuário.
        /// </summary>
        /// <returns>Valida os dados passados para criação do usuário e retorna os dados do usuário cadastrado.</returns>
        [AllowAnonymous]
        [HttpPost("create")]
        [ProducesResponseType(typeof(Response<CreateUserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<CreateUserResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<CreateUserResponse>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<CreateUserResponse>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Response<CreateUserResponse>>> CreateNewUser([FromBody] CreateUserRequest createUserRequest)
        {
            try
            {
                var response = await _service.CreateUser(createUserRequest);
                return StatusCode(StatusCodes.Status200OK, new Response<CreateUserResponse>() { Status = 200, Message = $"Usuário registrado com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new session!");
                switch (ex.Message)
                {
                    case "userEmailAlreadyRegistered":
                        return StatusCode(StatusCodes.Status409Conflict, new Response<CreateUserResponse>() { Status = 409, Message = $"Não foi possível registrar usuário. Usuário já está registrado com e-mail informado.", Success = false, Error = ex.ToString() });
                    case "userPhoneAlreadyRegistered":
                        return StatusCode(StatusCodes.Status409Conflict, new Response<CreateUserResponse>() { Status = 409, Message = $"Não foi possível registrar usuário. Usuário já está registrado com telefone informado.", Success = false, Error = ex.ToString() });

                    case "errorHashPassword":
                        return StatusCode(StatusCodes.Status419AuthenticationTimeout, new Response<CreateUserResponse>() { Status = 419, Message = $"Não foi possível registrar usuário. Verifique se o payload foi enviado corretamente.", Success = false, Error = ex.ToString() });
                    case "invalidToken":
                    case "emptyToken":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<CreateUserResponse>() { Status = 403, Message = $"Não foi possível registrar usuário. Verifique se o payload foi enviado corretamente.", Success = false, Error = ex.ToString() });
                    case "errorWhileInsertUserOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<CreateUserResponse>() { Status = 304, Message = $"Não foi possível registrar usuário. Erro no processo de inserção do usuário na base de dados.", Success = false, Error = ex.ToString() });
                    case "userRegisteredWithEmailNotSent":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<CreateUserResponse>() { Status = 304, Message = $"Usuário registrado porem houve erro no processo de envio do email com a senha.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateUserResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por solicitar um email de reset de senha.
        /// </summary>
        /// <returns>Valida os dados passados para resetar a senha e retorna a confirmação de envio do email de reset de senha.</returns>
        [AllowAnonymous]
        [HttpGet("forgot-password")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Response<bool>>> ForgotPassword([FromQuery] string email, UserRole userRole)
        {
            try
            {
                var response = await _service.ForgotPassword(email, userRole);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Email de recuperação de senha enviado com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while creating new session!");
                switch (ex.Message)
                {
                    case "userAlreadyRegistered":
                        return StatusCode(StatusCodes.Status409Conflict, new Response<CreateUserResponse>() { Status = 409, Message = $"Não foi possível registrar usuário. Usuário já está registrado com e-mail informado.", Success = false, Error = ex.ToString() });
                    case "errorHashPassword":
                        return StatusCode(StatusCodes.Status419AuthenticationTimeout, new Response<CreateUserResponse>() { Status = 419, Message = $"Não foi possível registrar usuário. Verifique se o payload foi enviado corretamente.", Success = false, Error = ex.ToString() });
                    case "invalidToken":
                    case "emptyToken":
                        return StatusCode(StatusCodes.Status403Forbidden, new Response<CreateUserResponse>() { Status = 403, Message = $"Não foi possível registrar usuário. Verifique se o payload foi enviado corretamente.", Success = false, Error = ex.ToString() });
                    case "errorWhileInsertUserOnDB":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<CreateUserResponse>() { Status = 304, Message = $"Não foi possível registrar usuário. Erro no processo de inserção do usuário na base de dados.", Success = false, Error = ex.ToString() });
                    case "userRegisteredWithEmailNotSent":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<CreateUserResponse>() { Status = 304, Message = $"Usuário registrado porem houve erro no processo de envio do email com a senha.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<CreateUserResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por solicitar um email de reset de senha.
        /// </summary>
        /// <returns>Valida os dados passados para resetar a senha e retorna a confirmação de envio do email de reset de senha.</returns>
        [Authorize]
        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Response<bool>>> ResetPassword([FromBody] RequestResetPassword requestResetPassword)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = await _service.ResetPassword(requestResetPassword, token);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Senha alterada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while reset password!");
                switch (ex.Message)
                {
                    case "passwordAndPasswordConfirmationNotMatch":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<bool>() { Status = 304, Message = $"Senha não alterada, senha e confirmação de senha não coincidem.", Success = false, Error = ex.ToString() });
                    case "unauthorized":
                        return StatusCode(StatusCodes.Status401Unauthorized, new Response<bool>() { Status = 401, Message = $"Senha não alterada, não foi possivel autenticar com a senha atual informada.", Success = false, Error = ex.ToString() });
                    case "errorUpdatePassword":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<bool>() { Status = 304, Message = $"Senha não alterada, tente novamente.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }


        /// <summary>
        /// Endpoint responsável por solicitar um email de reset de senha.
        /// </summary>
        /// <returns>Valida os dados passados para resetar a senha e retorna a confirmação de envio do email de reset de senha.</returns>
        [Authorize]
        [HttpPost("change-password")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Response<bool>>> ChangePassword([FromBody] RequestChangePassword requestChangePassword)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = await _service.ChangePassword(requestChangePassword, token);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Senha alterada com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while reset password!");
                switch (ex.Message)
                {
                    case "passwordAndPasswordConfirmationNotMatch":
                        return StatusCode(StatusCodes.Status404NotFound, new Response<bool>() { Status = 404, Message = $"Senha não alterada, senha e confirmação de senha não coincidem.", Success = false, Error = ex.ToString() });
                    case "unauthorized":
                        return StatusCode(StatusCodes.Status401Unauthorized, new Response<bool>() { Status = 401, Message = $"Senha não alterada, não foi possivel autenticar com a senha atual informada.", Success = false, Error = ex.ToString() });
                    case "errorUpdatePassword":
                        return StatusCode(StatusCodes.Status404NotFound, new Response<bool>() { Status = 404, Message = $"Senha não alterada, tente novamente.", Success = false, Error = ex.ToString() });
                    case "incorrectPassword":
                        return StatusCode(StatusCodes.Status404NotFound, new Response<bool>() { Status = 404, Message = $"Senha não alterada, a senha atual está incorreta.", Success = false, Error = ex.ToString() });
                    case "userNotExists":
                        return StatusCode(StatusCodes.Status404NotFound, new Response<bool>() { Status = 404, Message = $"Senha não alterada, usuário não existe.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por atualizar os dados de um usuario.
        /// </summary>
        /// <returns>Valida os dados passados para atualizar os dados de um usuario e retorna o usuario atualizado.</returns>
        [Authorize]
        [HttpPut("update")]
        [ProducesResponseType(typeof(Response<UpdateUserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<UpdateUserResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<UpdateUserResponse>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<UpdateUserResponse>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Response<UpdateUserResponse>>> UpdateUser([FromForm] UpdateUserRequest updateUserRequest)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = await _service.UpdateUser(updateUserRequest, token);
                return StatusCode(StatusCodes.Status200OK, new Response<UpdateUserResponse>() { Status = 200, Message = $"Usuário atualizado com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while update user!");
                switch (ex.Message)
                {
                    case "unauthorized":
                        return StatusCode(StatusCodes.Status401Unauthorized, new Response<UpdateUserResponse>() { Status = 401, Message = $"Usuário não alterado, não foi possivel autenticar para realizar a alteração dos dados.", Success = false, Error = ex.ToString() });
                    case "errorUpdatePassword":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<UpdateUserResponse>() { Status = 304, Message = $"Usuário não alterado, tente novamente.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<UpdateUserResponse>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }

        /// <summary>
        /// Endpoint responsável por atualizar os dados de um usuario.
        /// </summary>
        /// <returns>Valida os dados passados para atualizar os dados de um usuario e retorna o usuario atualizado.</returns>
        [Authorize]
        [HttpDelete("delete")]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
        public ActionResult<Response<bool>> DeleteUser([FromBody] List<Guid> ids)
        {
            try
            {
                var token = Request.Headers["Authorization"];
                var response = _service.DeleteUser(ids);
                return StatusCode(StatusCodes.Status200OK, new Response<bool>() { Status = 200, Message = $"Usuário apagado com sucesso.", Data = response, Success = true });
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while update user!");
                switch (ex.Message)
                {
                    case "unauthorized":
                        return StatusCode(StatusCodes.Status401Unauthorized, new Response<bool>() { Status = 401, Message = $"Usuário não apagado, não foi possivel autenticar para realizar a alteração dos dados.", Success = false, Error = ex.ToString() });
                    case "userNotExists":
                        return StatusCode(StatusCodes.Status304NotModified, new Response<bool>() { Status = 304, Message = $"Usuário não apagado, tente novamente.", Success = false, Error = ex.ToString() });
                    default:
                        return StatusCode(StatusCodes.Status500InternalServerError, new Response<bool>() { Status = 500, Message = $"Internal server error! Exception Detail: {ex.Message}", Success = false, Error = ex.ToString() });
                }
            }
        }
    }
}

