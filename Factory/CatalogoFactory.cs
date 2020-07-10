using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sora.Models.SaraModel;
using Sora.ViewModel;

namespace Sora.Factory
{  
    public class CatalogoFactory 
    {      
        private readonly SaraContext db;
        readonly string CatalogoInterfaceTypeName = typeof(ICatalogo).FullName;
        public CatalogoFactory(SaraContext _db){
            db = _db;
        }

        public IEnumerable<object> GetAll(string name){
            Type type = typeof(SaraContext);
            IEnumerable<object> result = null;
            //var context = Activator.CreateInstance(type);
            TypeFilter catalogFilter = new TypeFilter(CatalogoInterfaceFilter);
            
            var property = type.GetProperties().FirstOrDefault(x => x.GetMethod.IsVirtual
                && x.PropertyType.IsGenericType && (x.PropertyType.GenericTypeArguments[0].FindInterfaces(catalogFilter, CatalogoInterfaceTypeName).Length != 0 
                && x.PropertyType.GenericTypeArguments[0].Name ==name)
            );

            if (property != null)
                result = property.GetMethod.Invoke(db, null) as IEnumerable<object>;

            return result;            
        }

        private static bool CatalogoInterfaceFilter(Type m, object filterCriteria)
        {
            return (m.ToString() == filterCriteria.ToString());
            
        }
    }
}