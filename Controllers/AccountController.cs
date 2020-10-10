using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Sora.Factory;
using Sora.Models;
using Sora.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sora.Models.SaraModel;
using Sora.ViewModel;

namespace Sora.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly SaraContext db = null;
        private readonly AppSettings settings;
        private IUserService _userService;

        public AccountController(SaraContext _db, IOptions<AppSettings> _settings,IUserService userService)
        {
            this.db = _db;
            settings = _settings.Value;
            _userService = userService;
        }

        [HttpPost("api/account/auth")]
        public IActionResult Auth([FromBody] AuthenticateRequest model)
        {
            var response = _userService.Authenticate(model);

            if (response == null)
                return BadRequest("Username or password is incorrect");

            return Ok(response);
        }
    }
}
