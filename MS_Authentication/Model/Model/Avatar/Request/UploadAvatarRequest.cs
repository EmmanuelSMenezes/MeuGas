using Microsoft.AspNetCore.Http;

namespace Domain.Model
{
  public class UploadAvatarRequest
  {
    public IFormFile File { get; set; }
    public int bucketId = 1 ;
  }
}