using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sora.Models.SaraModel;

namespace Sora.Factory
{    
    
    public interface IGenericFactory<T> where T : class
    {
        IEnumerable<T> GetAll();
        IEnumerable<T> GetAll(Expression<Func<T, bool>> predicate);
        T GetById(int id);
        T FirstOrDefault(Expression<Func<T, bool>> predicate);
        void Insert(T obj);
        void InsertRange(IEnumerable<T> obj);

        void Update(T obj);
        void UpdateRange(IEnumerable<T> obj);
        void Delete(int id);
        void Delete(T obj);
        int DeleteAndSave(int id);
        int Save();
    }
    

}