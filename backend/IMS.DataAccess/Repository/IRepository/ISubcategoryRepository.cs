using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface ISubcategoryRepository : IRepository<Subcategory>
{
    Task<Subcategory> UpdateAsync(Subcategory entity);
}