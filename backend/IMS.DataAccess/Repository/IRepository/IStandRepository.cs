using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface IStandRepository : IRepository<Stand>
{
    Task<Stand> UpdateAsync(Stand entity);
}