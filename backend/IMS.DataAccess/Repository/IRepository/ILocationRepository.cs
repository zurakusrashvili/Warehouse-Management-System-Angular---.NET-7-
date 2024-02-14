using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface ILocationRepository : IRepository<Location>
{
    Task<Location> UpdateAsync(Location entity);
}