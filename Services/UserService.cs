
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Sora.Factory;
using Sora.Models.SaraModel;
using Sora.ViewModel;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;


namespace Sora.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        Usuarios GetById(string username);
    }

    public class UserService : IUserService
    {
        // users hardcoded for simplicity, store in a db with hashed passwords in production applications


        private readonly AppSettings _appSettings;
         private readonly SaraContext _db;
         private readonly UsuarioFactory userFactory = null;

        public UserService(IOptions<AppSettings> appSettings, SaraContext db)
        {
            _appSettings = appSettings.Value;
            _db = db;
            userFactory = new UsuarioFactory(_db);
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {          
            var user = userFactory.Auth(model.Username, model.Password);

            // return null if user not found
            if (user == null) return null;

            // authentication successful so generate jwt token
            var token = generateJwtToken(user);

            return new AuthenticateResponse(user, token);
        }

        public Usuarios GetById(string username)
        {
            return userFactory.GetById(username);
        }

        // helper methods

        private string generateJwtToken(Usuarios user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("username", user.Username) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}