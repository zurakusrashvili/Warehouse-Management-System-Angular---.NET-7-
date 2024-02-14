using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface IWarehouseRepository : IRepository<Warehouse>
{
    Task<Warehouse> UpdateAsync(Warehouse entity);
}