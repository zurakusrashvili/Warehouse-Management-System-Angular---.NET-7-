using IMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IMS.DataAccess.Repository.IRepository
{
    public interface ISalesOrderRepository : IRepository<SalesOrder>
    {
        Task<SalesOrder> UpdateAsync(SalesOrder entity);
    }
}
