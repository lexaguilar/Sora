using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sora.Models.SaraModel;

namespace Sora.Factory
{  
    public class GenericFactory<T> : IGenericFactory<T> where T : class
    {      
         private SaraContext db = null;
        private DbSet<T> entity = null;

        public GenericFactory()
        {
            this.db = new SaraContext();
            entity = db.Set<T>();
        }

        public GenericFactory(SaraContext _db)
        {
            this.db = _db;
            entity = db.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            return entity.ToArray();
        }

        public T GetById(int id)
        {
            return entity.Find(id);
        }

        public void Insert(T obj)
        {
            entity.Add(obj);
        }

        public void Update(T obj)
        {
            entity.Attach(obj);
            db.Entry(obj).State = EntityState.Modified;
        }

        public void Delete(int id)
        {
            T existing = entity.Find(id);
            entity.Remove(existing);
        }

        public int Save()
        {
            return db.SaveChanges();
        }

    }
}