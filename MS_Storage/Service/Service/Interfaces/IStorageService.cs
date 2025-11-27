using System.Threading.Tasks;
using Domain.Model;

namespace Application.Service
{
  public interface IStorageService
  {
    Task<UploadFileResponse> UploadFileService(UploadFileRequest uploadFileRequest);
  }
}