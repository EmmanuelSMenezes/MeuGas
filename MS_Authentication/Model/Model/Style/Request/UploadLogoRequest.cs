using Microsoft.AspNetCore.Http;

namespace Domain.Model
{
    public class UploadLogoRequest
    {
        public IFormFile File { get; set; }
        public int bucketId = 3;
    }
}