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
using IMS.Models.DTO.Warehouse;

namespace IMS.API.Controllers;

[Route("api/warehouses")]
[ApiController]
//Deprecated = true
public class WarehouseController : Controller
{
    protected APIResponse _response;
    private readonly IWarehouseRepository _dbWarehouse;
    private readonly IMapper _mapper;
    private readonly IFileRepository _fileRepository;
    private readonly IUtilsRepository _utils;
    public WarehouseController(IWarehouseRepository dbWarehouse, IMapper mapper, IFileRepository fileRepository, IUtilsRepository utilsRepository)
    {
        _dbWarehouse = dbWarehouse;
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
    public async Task<ActionResult<APIResponse>> GetWarehouses(
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
            IEnumerable<Warehouse> warehouseList;

            warehouseList = await _dbWarehouse.GetAllAsync(filter: p => p.UserId == _userId || p.Id == 1, pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<WarehouseDTO>>(warehouseList);
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
    [HttpGet("{id:int}", Name = "GetWarehouse")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetWarehouse(int id)
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
            var Warehouse = await _dbWarehouse.GetAsync(x => x.Id == id && x.UserId == _userId || x.Id == 1);
            if (Warehouse == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<WarehouseDTO>(Warehouse);

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
    public async Task<ActionResult<APIResponse>> CreateWarehouse([FromBody] WarehouseCreateDTO createDTO)
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
            if (await _dbWarehouse.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower() && x.UserId == _userId) != null)
            {
                ModelState.AddModelError("CustomError", "Warehouse already exists");
                return BadRequest(ModelState);
            }

          

            Warehouse Warehouse = _mapper.Map<Warehouse>(createDTO);

            await _dbWarehouse.CreateAsync(Warehouse);
            await _dbWarehouse.SaveAsync();

            _response.Result = _mapper.Map<WarehouseDTO>(Warehouse);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetWarehouse", new { id = Warehouse.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteWarehouse")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteWarehouse(int id)
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
            var warehouse = await _dbWarehouse.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (warehouse == null)
            {
                return NotFound();
            }

            await _dbWarehouse.RemoveAsync(warehouse);
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
    [HttpPut("{id:int}", Name = "UpdateWarehouse")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateWarehouse(int id, [FromBody] WarehouseUpdateDTO updateDto)
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
            Warehouse Warehouse = _mapper.Map<Warehouse>(updateDto);

            await _dbWarehouse.UpdateAsync(Warehouse);
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
    //public IActionResult Add([FromForm] Warehouse model)
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
    //        var warehouseResult = _dbWarehouse.Add(model);
    //        if (warehouseResult)
    //        {
    //            status.StatusCode = 1;
    //            status.Message = "Added Successfully";
    //        }
    //        else
    //        {
    //            status.StatusCode = 0;
    //            status.Message = "Error on adding warehouse";
    //        }

    //    }
    //    return Ok(status);
    //}
}
