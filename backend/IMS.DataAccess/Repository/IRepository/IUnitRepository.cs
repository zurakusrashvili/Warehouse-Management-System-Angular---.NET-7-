using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface IUnitRepository : IRepository<Unit>
{
    Task<Unit> UpdateAsync(Unit entity);
}