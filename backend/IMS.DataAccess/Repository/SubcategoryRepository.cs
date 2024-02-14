using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository
{
    public class SubcategoryRepository : Repository<Subcategory>, ISubcategoryRepository
    {
        private readonly ApplicationDbContext _db;

        public SubcategoryRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Subcategory> UpdateAsync(Subcategory entity)
        {
            _db.Subcategories.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
