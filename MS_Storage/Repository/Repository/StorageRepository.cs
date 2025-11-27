using Serilog;
using Domain.Model;
using System.Threading.Tasks;
using Amazon.S3;
using System;
using System.IO;
using Amazon.S3.Transfer;
using Amazon.S3.Model;

namespace Infrastructure.Repository
{
    public class StorageRepository : IStorageRepository
    {
        private readonly MinioSettings _minioSettings;
        private readonly ILogger _logger;
        public StorageRepository(MinioSettings minioSettings, ILogger logger)
        {
            _minioSettings = minioSettings;
            _logger = logger;
        }

        public async Task<UploadFileResponse> UploadFile(UploadFileRequest uploadFileRequest)
        {
            try
            {
                var bucket = uploadFileRequest.bucketId switch
                {
                    Buckets.avatarimages => "avatarimages",
                    Buckets.productbaseimages => "productbaseimages",
                    Buckets.logopartner => "logopartner",
                    _ => "default"
                };

                var config = new AmazonS3Config()
                {
                    ServiceURL = _minioSettings.Host,
                    ForcePathStyle = true
                };

                using (var amazonS3Client = new AmazonS3Client(_minioSettings.Username, _minioSettings.Password, config))
                {
                    using (var newMemoryStream = new MemoryStream())
                    {
                        uploadFileRequest.File.CopyTo(newMemoryStream);

                        var upload = new TransferUtilityUploadRequest()
                        {
                            InputStream = newMemoryStream,
                            Key = uploadFileRequest.File.FileName,
                            BucketName = bucket,
                            CannedACL = S3CannedACL.PublicRead
                        };

                        var fileTransferUtility = new TransferUtility(amazonS3Client);
                        await fileTransferUtility.UploadAsync(upload);

                        GetPreSignedUrlRequest request = new GetPreSignedUrlRequest()
                        {
                            BucketName = bucket,
                            Key = upload.Key,
                            Expires = DateTime.Now.AddYears(999)
                        };

                        string path = amazonS3Client.GetPreSignedURL(request);

                        _logger.Information("[UploadRepository - UploadFile]: archive uploaded with success.");
                        return new UploadFileResponse()
                        {
                            IsUploaded = true,
                            Url = path
                        };
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[UploadRepository - UploadFile]: Error while upload archive.");
                throw ex;
            }
        }
    }
}
