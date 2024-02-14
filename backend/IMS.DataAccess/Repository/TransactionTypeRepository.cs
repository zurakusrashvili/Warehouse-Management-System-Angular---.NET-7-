using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate.Linq;

namespace IMS.DataAccess.Repository
{
    public class TransactionTypeRepository : Repository<TransactionType>, ITransactionTypeRepository
    {
        private readonly ApplicationDbContext _db;

        public TransactionTypeRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<TransactionType> UpdateAsync(TransactionType entity)
        {
            _db.TransactionTypes.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<List<TransactionType>> GetAllTypes()
        {
            return await _db.TransactionTypes.ToListAsync();
        }
    }
}
