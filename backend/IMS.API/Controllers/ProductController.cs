using AutoMapper;
using IMS.DataAccess.Repository;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;
using IMS.Models.DTO.Product;

namespace IMS.API.Controllers;

[Route("api/products")]
[ApiController]
//Deprecated = true
public class ProductController : Controller
{
    protected APIResponse _response;
    private readonly IProductRepository _dbProduct;
    private readonly IMapper _mapper;
    private readonly IFileRepository _fileRepository;
    private readonly IUtilsRepository _utils;
    public ProductController(IProductRepository dbProduct, IMapper mapper, IFileRepository fileRepository, IUtilsRepository utilsRepository)
    {
        _dbProduct = dbProduct;
        _mapper = mapper;
        _fileRepository = fileRepository;
        _response = new();
        _utils = utilsRepository;
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetProducts(
        [FromQuery] string? search,
         int pageSize = 0,
         int pageNumber = 1
        )
    {
        var _userId = _utils.GetUserId(Request.Cookies["token"]);
        if (String.IsNullOrWhiteSpace(_userId))
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.Unauthorized;
            _response.ErrorMessages = new List<string>()
                {
                    "You Need To Authorise First"
                };
            return _response;
        }

        try
        {
            IEnumerable<Product> productList;

            productList = await _dbProduct.GetAllAsync(filter: p => p.UserId == _userId, pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<ProductDTO>>(productList);
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;

    }
    [HttpGet("{id:int}", Name = "GetProduct")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetProduct(int id)
    {

        var _userId = _utils.GetUserId(Request.Cookies["token"]);
        if (String.IsNullOrWhiteSpace(_userId))
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.Unauthorized;
            _response.ErrorMessages = new List<string>()
                {
                    "You Need To Authorise First"
                };
            return _response;
        }
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
            var Product = await _dbProduct.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (Product == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<ProductDTO>(Product);

            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpPost]
    //[Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<APIResponse>> CreateProduct([FromForm] ProductCreateDTO createDTO)
    {

        var _userId = _utils.GetUserId(Request.Cookies["token"]);
        if (String.IsNullOrWhiteSpace(_userId))
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.Unauthorized;
            _response.ErrorMessages = new List<string>()
                {
                    "You Need To Authorise First"
                };
            return _response;
        }
        try
        {
            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }
            
            createDTO.UserId = _userId;
            if (await _dbProduct.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower() && x.UserId == _userId) != null)
            {
                ModelState.AddModelError("CustomError", "Product already exists");
                return BadRequest(ModelState);
            }

          

            if (createDTO.ImageFile != null)
            {
                var fileResult = _fileRepository.SaveImage(createDTO.ImageFile);
                if (fileResult.Item1 == 1)
                {
                    createDTO.ImageName = fileResult.Item2; //getting name of image
                }
            }

            Product Product = _mapper.Map<Product>(createDTO);

            await _dbProduct.CreateAsync(Product);
            await _dbProduct.SaveAsync();

            _response.Result = _mapper.Map<ProductDTO>(Product);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetProduct", new { id = Product.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteProduct")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteProduct(int id)
    {

        var _userId = _utils.GetUserId(Request.Cookies["token"]);
        if (String.IsNullOrWhiteSpace(_userId))
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.Unauthorized;
            _response.ErrorMessages = new List<string>()
                {
                    "You Need To Authorise First"
                };
            return _response;
        }
        try
        {
            if (id == 0)
            {
                return BadRequest();
            }
            var Product = await _dbProduct.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (Product == null)
            {
                return NotFound();
            }

            await _dbProduct.RemoveAsync(Product);
            _response.StatusCode = HttpStatusCode.NoContent;
            _response.IsSuccess = true;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }
    //[Authorize(Roles = "admin")]
    [HttpPut("{id:int}", Name = "UpdateProduct")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateProduct(int id, [FromForm] ProductUpdateDTO updateDto)
    {
        var _userId = _utils.GetUserId(Request.Cookies["token"]);
        if (String.IsNullOrWhiteSpace(_userId))
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.Unauthorized;
            _response.ErrorMessages = new List<string>()
                {
                    "You Need To Authorise First"
                };
            return _response;
        }

        try
        {
            if(updateDto == null || id != updateDto.Id)
            {
                return BadRequest();
            }

            if (updateDto.ImageFile != null)
            {
                var fileResult = _fileRepository.SaveImage(updateDto.ImageFile);
                if (fileResult.Item1 == 1)
                {
                    updateDto.ImageName = fileResult.Item2; //getting name of image
                }
            }
            updateDto.UserId = _userId;
            Product Product = _mapper.Map<Product>(updateDto);

            await _dbProduct.UpdateAsync(Product);
            _response.StatusCode = HttpStatusCode.NoContent;
            _response.IsSuccess = true;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess= false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    //[HttpPost]
    //public IActionResult Add([FromForm] Product model)
    //{
    //    var status = new Status();
    //    if (!ModelState.IsValid)
    //    {
    //        status.StatusCode = 0;
    //        status.Message = "Please pass the valid data";
    //        return Ok(status);
    //    }
    //    if (model.ImageFile != null)
    //    {
    //        var fileResult = _fileRepository.SaveImage(model.ImageFile);
    //        if (fileResult.Item1 == 1)
    //        {
    //            model.ImageFile = fileResult.Item2; //getting name of image
    //        }
    //        var productResult = _dbProduct.Add(model);
    //        if (productResult)
    //        {
    //            status.StatusCode = 1;
    //            status.Message = "Added Successfully";
    //        }
    //        else
    //        {
    //            status.StatusCode = 0;
    //            status.Message = "Error on adding product";
    //        }

    //    }
    //    return Ok(status);
    //}
}
