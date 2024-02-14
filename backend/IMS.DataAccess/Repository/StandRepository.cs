using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class StandRepository : Repository<Stand>, IStandRepository
    {
        private readonly ApplicationDbContext _db;

        public StandRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Stand> UpdateAsync(Stand entity)
        {
            _db.Stands.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
