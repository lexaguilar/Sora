using System.Linq;
using Sora.Models.SaraModel;

namespace Sora.Factory
{
    public class UsuarioFactory
    {
        private SaraContext db = null;       

        public UsuarioFactory(SaraContext _db)
        {
            this.db = _db;
        }

        public Usuarios GetById(string username){
            return db.Usuarios.FirstOrDefault(x => x.Username == username);
        }       

        public Usuarios Auth(string username, string password)
        {
            var pass = password.GetPasswordHashedSHA256();

            //TODO : agregar condicion de la pass
            var result = db.Usuarios.FirstOrDefault(x => x.Username == username);
            
            return result;
        }

        
    }
}