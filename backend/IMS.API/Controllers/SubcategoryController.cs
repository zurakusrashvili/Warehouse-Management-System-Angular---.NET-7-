using AutoMapper;
using IMS.DataAccess.Repository;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.DTO.Subcategory;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/product-subcategories")]
[ApiController]
//Deprecated = true
public class SubcategoryController : Controller
{
    protected APIResponse _response;
    private readonly ISubcategoryRepository _dbSubcategory;
    private readonly IMapper _mapper;
    private readonly IUtilsRepository _utils;

    public SubcategoryController(ISubcategoryRepository dbSubcategory, IMapper mapper, IUtilsRepository utilsRepository)
    {
        _dbSubcategory = dbSubcategory;
        _mapper = mapper;
        _response = new();
        _utils = utilsRepository;
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetProductCategories(
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
            IEnumerable<Subcategory> subcategoryList;

            subcategoryList = await _dbSubcategory.GetAllAsync(filter: c => c.UserId == _userId,pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<SubcategoryDTO>>(subcategoryList);
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
    [HttpGet("{id:int}", Name = "GetSubcategory")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetSubcategory(int id)
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
            var subcategory = await _dbSubcategory.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (subcategory == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<Subcategory>(subcategory);
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
    public async Task<ActionResult<APIResponse>> CreateSubcategory([FromBody] SubcategoryCreateDTO createDTO)
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
            createDTO.UserId = _userId;
            if (await _dbSubcategory.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower() && x.UserId == _userId) != null)
            {
                ModelState.AddModelError("CustomError", "Subcategory already exists");
                return BadRequest(ModelState);
            }

            if (createDTO == null)
            {
                return BadRequest(createDTO);
            }

            Subcategory subcategory = _mapper.Map<Subcategory>(createDTO);

            await _dbSubcategory.CreateAsync(subcategory);
            await _dbSubcategory.SaveAsync();

            _response.Result = _mapper.Map<SubcategoryDTO>(subcategory);
            _response.StatusCode = HttpStatusCode.Created;
            return CreatedAtRoute("GetSubcategory", new { id = subcategory.Id }, _response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return _response;
    }

    [HttpDelete("{id:int}", Name = "DeleteSubcategory")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteSubcategory(int id)
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
            var subcategory = await _dbSubcategory.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (subcategory == null)
            {
                return NotFound();
            }

            await _dbSubcategory.RemoveAsync(subcategory);
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
    [HttpPut("{id:int}", Name = "UpdateSubcategory")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateSubcategory(int id, [FromBody] SubcategoryUpdateDTO updateDto)
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
            Subcategory subcategory = _mapper.Map<Subcategory>(updateDto);

            await _dbSubcategory.UpdateAsync(subcategory);
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
