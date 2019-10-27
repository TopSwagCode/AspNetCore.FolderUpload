using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TopSwagCode.AspNetCore.FolderUpload.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
    {

        private readonly ILogger<UploadController> _logger;

        public UploadController(ILogger<UploadController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("/upload/{filename}/{fullpath}")]
        public IActionResult Upload(string filename, string fullpath)
        {
            
            var rootFolder = Directory.GetCurrentDirectory();

            var uploadFolder = rootFolder + "\\uploads";

            var filenameDecoded = System.Web.HttpUtility.UrlDecode(filename);
            var fullpathDecoded = System.Web.HttpUtility.UrlDecode(fullpath);

            var path = fullpathDecoded.Replace(filenameDecoded, "");

            System.IO.Directory.CreateDirectory($"{uploadFolder}{path}");

            using (Stream output = System.IO.File.OpenWrite(uploadFolder + fullpathDecoded))
            using (Stream input = Request.BodyReader.AsStream())
            {
                input.CopyTo(output);
            }

            return Ok();
        }
    }
}
