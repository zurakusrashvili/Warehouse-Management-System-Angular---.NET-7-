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
using IMS.Models.DTO.Stand;

namespace IMS.API.Controllers;

[Route("api/stands")]
[ApiController]
//Deprecated = true
public class StandController : Controller
{
    protected APIResponse _response;
    private readonly IStandRepository _unitRepository;
    private readonly IMapper _mapper;
    private readonly IFileRepository _fileRepository;
    private readonly IUtilsRepository _utils;
    public StandController(IStandRepository unitRepository, IMapper mapper, IFileRepository fileRepository, IUtilsRepository utilsRepository)
    {
        _unitRepository = unitRepository;
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
    public async Task<ActionResult<APIResponse>> GetStands(
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
            IEnumerable<Stand> standList;

            standList = await _unitRepository.GetAllAsync(filter: p => p.UserId == _userId || p.Id == 1, pageSize: pageSize, pageNumber: pageNumber, includeProperties: "Locations");

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<StandDTO>>(standList);
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
    [HttpGet("{id:int}", Name = "GetStand")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetStand(int id)
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
            var Stand = await _unitRepository.GetAsync(x => x.Id == id && x.UserId == _userId || x.Id == 1);
            if (Stand == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<StandDTO>(Stand);

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
    public async Task<ActionResult<APIResponse>> CreateStand([FromBody] StandCreateDTO createDTO)
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
            if (await _unitRepository.GetAsync(x => x.StandName.ToLower() == createDTO.StandName.ToLower() && x.WarehouseId == createDTO.WarehouseId && x.UserId == _userId) != null)
            {
                ModelState.AddModelError("CustomError", "Stand already exists");
                return BadRequest(ModelState);
            }

            Stand Stand = _mapper.Map<Stand>(createDTO);

            await _unitRepository.CreateAsync(Stand);
            await _unitRepository.SaveAsync();

            _response.Result = _mapper.Map<StandDTO>(Stand);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetStand", new { id = Stand.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteStand")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteStand(int id)
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
            var Stand = await _unitRepository.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (Stand == null)
            {
                return NotFound();
            }

            await _unitRepository.RemoveAsync(Stand);
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
    [HttpPut("{id:int}", Name = "UpdateStand")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateStand(int id, [FromBody] StandUpdateDTO updateDto)
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
            Stand Stand = _mapper.Map<Stand>(updateDto);

            await _unitRepository.UpdateAsync(Stand);
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

}
