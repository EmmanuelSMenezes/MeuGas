using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Model;
using Infrastructure.Repository;
using Serilog;

namespace Application.Service
{
    public class CollaboratorService : ICollaboratorService
    {
        private readonly ILogger _logger;
        private readonly ICollaboratorRepository _repository;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly IUserService _userService;
        private readonly ICommunicationService _communicationService;
        private readonly string _privateSecretKey;
        private readonly string _tokenValidationMinutes;
        private readonly BaseURLWebApplication _baseURLWebApplication;

        public CollaboratorService(
          ICollaboratorRepository repository,
          IEmailTemplateService emailTemplateService,
          IUserService userService,
          ICommunicationService communicationService,
          ILogger logger,
          BaseURLWebApplication baseURLWebApplication,
          string tokenValidationMinutes,
          string privateSecretKey
          )
        {
            _logger = logger;
            _repository = repository;
            _emailTemplateService = emailTemplateService;
            _userService = userService;
            _baseURLWebApplication = baseURLWebApplication;
            _communicationService = communicationService;
            _tokenValidationMinutes = tokenValidationMinutes;
            _privateSecretKey = privateSecretKey;
        }

        public async Task<Collaborator> CreateCollaborator(CreateCollaboratorRequest createCollaboratorRequest, string token)
        {
            try
            {
                var decodedToken = _userService.GetDecodeToken(token.Split(' ')[1], _privateSecretKey);
                createCollaboratorRequest.Created_by = decodedToken.UserId;

                var generatedPassword = _userService.GeneratePassword();
                createCollaboratorRequest.generatedPassword = generatedPassword;
                createCollaboratorRequest.Password = _userService.HashPassword(generatedPassword);

                var getCollaborator = _userService.GetUserByEmail(createCollaboratorRequest.Email, createCollaboratorRequest.RoleName.ToString());

                if (getCollaborator != null) throw new Exception("userEmailAlreadyRegistered");

                var response = _repository.CreateCollaborator(createCollaboratorRequest);



                var emailTemplate = _emailTemplateService.FirstAccessCollaborator(
                  new FirstAccessCollaborator()
                  {
                      User_fullName = response.Profile.Fullname,
                      GeneratedPassword = generatedPassword,
                      User_Email = response.Email,
                      Link_portal = response.Role.Tag.ToString().Equals(UserRole.PART.ToString()) ? _baseURLWebApplication.Partner : _baseURLWebApplication.Administrator
                  }
                ); ;
                var sendEmailStatus = await _communicationService.SendMail(
                  response.Email,
                  emailTemplate.Subject,
                  emailTemplate.Body,
                  _userService.GenerateToken(
                    _privateSecretKey,
                    _tokenValidationMinutes,
                    response.User_id,
                    response.Profile.Fullname,
                    response.Email,
                    response.Role.Role_id
                  )
                );
                if (sendEmailStatus)
                {
                    _logger.Information("[CollaboratorService - CreateCollaborator]: Email sended with successfully");
                }
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool DeleteCollaborator(List<Guid> ids)
        {
            try
            {
                var response = _repository.DeleteCollaborator(ids);
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ListCollaborators ListCollaboratorsBySponsorId(FilterCollaborator filter, Guid sponsor_id)
        {
            try
            {
                var response = _repository.ListCollaboratorsBySponsorId(filter, sponsor_id);
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool UpdateCollaborator(List<UpdateCollaboratorRequest> updateCollaboratorRequestList)
        {
            try
            {
                var response = _repository.UpdateCollaborator(updateCollaboratorRequestList);
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
