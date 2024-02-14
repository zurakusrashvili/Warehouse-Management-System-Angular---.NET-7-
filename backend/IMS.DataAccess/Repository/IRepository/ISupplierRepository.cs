using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface ISupplierRepository : IRepository<Supplier>
{
    Task<Supplier> UpdateAsync(Supplier entity);
}