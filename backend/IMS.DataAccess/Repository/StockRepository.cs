using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class StockRepository : Repository<Stock>, IStockRepository
    {
        private readonly ApplicationDbContext _db;

        public StockRepository(ApplicationDbContext db):base(db)
        {
            _db = db;
        }

        public async Task<Stock> UpdateAsync(Stock entity)
        {
            _db.Stock.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
