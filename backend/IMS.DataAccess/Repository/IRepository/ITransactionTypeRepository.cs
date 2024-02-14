using IMS.Models;

namespace IMS.DataAccess.Repository.IRepository;

public interface ITransactionTypeRepository : IRepository<TransactionType>
{
    Task<TransactionType> UpdateAsync(TransactionType entity);
    Task<List<TransactionType>> GetAllTypes();
}