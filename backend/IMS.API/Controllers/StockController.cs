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
using IMS.Models.DTO.Stock;

namespace IMS.API.Controllers;

[Route("api/stocks")]
[ApiController]
//Deprecated = true
public class StockController : Controller
{
    protected APIResponse _response;
    private readonly IStockRepository _dbStock;
    private readonly IMapper _mapper;
    private readonly IFileRepository _fileRepository;
    private readonly IUtilsRepository _utils;
    public StockController(IStockRepository dbStock, IMapper mapper, IFileRepository fileRepository, IUtilsRepository utilsRepository)
    {
        _dbStock = dbStock;
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
    public async Task<ActionResult<APIResponse>> GetStocks(
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
            IEnumerable<Stock> stockList;

            stockList = await _dbStock.GetAllAsync(filter: p => p.UserId == _userId, pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<StockDTO>>(stockList);
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
    [HttpGet("{id:int}", Name = "GetStock")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetStock(int id)
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
            var Stock = await _dbStock.GetAsync(x => x.Id == id && x.UserId == _userId,includeProperties: "Location,Product,ProductUnit,Supplier");
            if (Stock == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<StockDTO>(Stock);

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
    public async Task<ActionResult<APIResponse>> CreateStock([FromBody] StockCreateDTO createDTO)
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
            if (await _dbStock.GetAsync(x => x.ProductId == createDTO.ProductId && x.UserId == _userId && x.SupplierId == createDTO.SupplierId) != null)
            {
                ModelState.AddModelError("CustomError", "Stock already exists");
                return BadRequest(ModelState);
            }

            if (createDTO.QtyInStock != 0 && createDTO.SalesPrice != 0)
            {
                createDTO.ValueOnHand = createDTO.QtyInStock * createDTO.SalesPrice;
            }
    
            Stock Stock = _mapper.Map<Stock>(createDTO);

            await _dbStock.CreateAsync(Stock);
            await _dbStock.SaveAsync();

            _response.Result = _mapper.Map<StockDTO>(Stock);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetStock", new { id = Stock.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteStock")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteStock(int id)
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
            var Stock = await _dbStock.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (Stock == null)
            {
                return NotFound();
            }

            await _dbStock.RemoveAsync(Stock);
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
    [HttpPut("{id:int}", Name = "UpdateStock")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateStock(int id, [FromBody] StockUpdateDTO updateDto)
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

            updateDto.UserId = _userId;

            if (updateDto.QtyInStock != 0 && updateDto.SalesPrice != 0)
            {
                updateDto.ValueOnHand = updateDto.QtyInStock * updateDto.SalesPrice;
            }
            
            Stock Stock = _mapper.Map<Stock>(updateDto);

            await _dbStock.UpdateAsync(Stock);
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
    //public IActionResult Add([FromForm] Stock model)
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
    //        var stockResult = _dbStock.Add(model);
    //        if (stockResult)
    //        {
    //            status.StatusCode = 1;
    //            status.Message = "Added Successfully";
    //        }
    //        else
    //        {
    //            status.StatusCode = 0;
    //            status.Message = "Error on adding stock";
    //        }

    //    }
    //    return Ok(status);
    //}
}
