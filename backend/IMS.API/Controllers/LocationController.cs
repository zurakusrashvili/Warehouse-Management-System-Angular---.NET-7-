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
using IMS.Models.DTO.Location;

namespace IMS.API.Controllers;

[Route("api/locations")]
[ApiController]
//Deprecated = true
public class LocationController : Controller
{
    protected APIResponse _response;
    private readonly ILocationRepository _dbLocation;
    private readonly IMapper _mapper;
    private readonly IFileRepository _fileRepository;
    private readonly IUtilsRepository _utils;
    public LocationController(ILocationRepository dbLocation, IMapper mapper, IFileRepository fileRepository, IUtilsRepository utilsRepository)
    {
        _dbLocation = dbLocation;
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
    public async Task<ActionResult<APIResponse>> GetLocations(
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
            IEnumerable<Location> productList;

            productList = await _dbLocation.GetAllAsync(filter: p => p.UserId == _userId || p.Id == 1, pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<LocationDTO>>(productList);
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
    [HttpGet("{id:int}", Name = "GetLocation")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetLocation(int id)
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
            var Location = await _dbLocation.GetAsync(x => x.Id == id && x.UserId == _userId || x.Id == 1);
            if (Location == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<LocationDTO>(Location);

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
    public async Task<ActionResult<APIResponse>> CreateLocation([FromBody] LocationCreateDTO createDTO)
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
            if (await _dbLocation.GetAsync(x => x.PlaceNumber == createDTO.PlaceNumber && x.ShelfNumber == createDTO.ShelfNumber && x.StandId == createDTO.StandId && x.UserId == _userId) != null)
            {
                ModelState.AddModelError("CustomError", "Location already exists");
                return BadRequest(ModelState);
            }

          

            Location Location = _mapper.Map<Location>(createDTO);

            await _dbLocation.CreateAsync(Location);
            await _dbLocation.SaveAsync();

            _response.Result = _mapper.Map<LocationDTO>(Location);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetLocation", new { id = Location.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteLocation")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteLocation(int id)
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
            var Location = await _dbLocation.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (Location == null)
            {
                return NotFound();
            }

            await _dbLocation.RemoveAsync(Location);
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
    [HttpPut("{id:int}", Name = "UpdateLocation")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateLocation(int id, [FromBody] LocationUpdateDTO updateDto)
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
            Location Location = _mapper.Map<Location>(updateDto);

            await _dbLocation.UpdateAsync(Location);
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
    //public IActionResult Add([FromForm] Location model)
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
    //        var productResult = _dbLocation.Add(model);
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
