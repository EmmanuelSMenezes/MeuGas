using System.Threading.Tasks;
using Domain.Model;

namespace Infrastructure.Repository
{
  public interface IStorageRepository
  {
    Task<UploadFileResponse> UploadFile(UploadFileRequest uploadFileRequest);
  }
}
