using Microsoft.AspNetCore.Http;

namespace IMS.DataAccess.Repository.IRepository
{
    public interface IFileRepository
    {
        public Tuple<int, string> SaveImage(IFormFile imageFile);
        public bool DeleteImage(string imageFileName);
    }
}
