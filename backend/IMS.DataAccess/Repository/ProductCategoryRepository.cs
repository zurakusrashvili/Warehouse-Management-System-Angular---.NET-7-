using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class ProductCategoryRepository : Repository<ProductCategory>, IProductCategoryRepository
    {
        private readonly ApplicationDbContext _db;

        public ProductCategoryRepository(ApplicationDbContext db):base(db)
        {
            _db = db;
        }
        public async Task<ProductCategory> UpdateAsync(ProductCategory entity)
        {
            _db.ProductCategories.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
