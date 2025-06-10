using KanBanBoard.DTO;
using KanBanBoard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KanBanBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        async public Task Login(LoginDTO loginDTO)
        {

        }

        [HttpPost("Logout")]
        [Authorize]
        async public Task Logout()
        {

        }
    }
}
