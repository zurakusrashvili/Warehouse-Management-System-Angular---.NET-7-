using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class SalesOrderRepository : Repository<SalesOrder>, ISalesOrderRepository
    {
        private readonly ApplicationDbContext _db;

        public SalesOrderRepository(ApplicationDbContext db):base(db)
        {
            _db = db;
        }

        public Task<SalesOrder> GetAllSalesOrder(SalesOrder entity)
        {
            throw new NotImplementedException();
        }

        public async Task<SalesOrder> UpdateAsync(SalesOrder entity)
        {
            _db.SalesOrders.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
