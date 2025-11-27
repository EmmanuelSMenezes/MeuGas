using Serilog;
using System;
using System.Threading.Tasks;
using Domain.Model;
using Infrastructure.Repository;

namespace Application.Service
{
  public class StorageService : IStorageService
    {
        private readonly IStorageRepository _storageRepository;
        private readonly ILogger _logger;

        public StorageService(
            IStorageRepository repository,
            ILogger logger
            )
        {
            _storageRepository = repository;
            _logger = logger;
        }

    public async Task<UploadFileResponse> UploadFileService(UploadFileRequest uploadFileRequest)
    {
      try
      {
        return await _storageRepository.UploadFile(uploadFileRequest);
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[UploadService - UploadFile]: Error while upload archive.");
        throw ex;
      }
    }
  }
}