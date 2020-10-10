using System.ComponentModel.DataAnnotations;
using Sora.Models.SaraModel;

namespace Sora.ViewModel
{  

    public class AuthenticateResponse
    {
        public string Nombre { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }


        public AuthenticateResponse(Usuarios user, string token)
        {
            Nombre = user.Nombre;
            Username = user.Username;
            Token = token;
        }
    }

}