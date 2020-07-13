
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class AboutController : Controller
    {

        [Route("api/about/get-info")]
        public IActionResult Get() => Json(new {
            Name = "Sora",
            Program.version,
            FullName= "App Sora Counting"
        });       

    }
}
