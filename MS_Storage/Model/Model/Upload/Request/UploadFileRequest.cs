using Microsoft.AspNetCore.Http;

namespace Domain.Model
{
    public class UploadFileRequest
    {
        public IFormFile File { get; set; }
        public Buckets? bucketId { get; set; }
    }
}