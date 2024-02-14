using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository.IRepository
{
    public interface IRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync(Expression<Func<T, bool>>? 
                                    filter=null, 
                                    string? includeProperties = null, 
                                    Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
                                    int pageSize = 0, 
                                    int pageNumber = 1);
        Task<T> GetAsync(Expression<Func<T, bool>>? 
                        filter = null, 
                        bool tracked = true, 
                        string? includeProperties = null);
        Task CreateAsync(T entity);
        Task RemoveAsync(T entity);
        Task SaveAsync();
    }
}
