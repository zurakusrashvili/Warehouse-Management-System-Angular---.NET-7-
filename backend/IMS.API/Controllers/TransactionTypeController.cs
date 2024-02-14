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
using IMS.Models.DTO.TransactionType;

namespace IMS.API.Controllers;

[Route("api/transactionTypes")]
[ApiController]
//Deprecated = true
public class TransactionTypeController : Controller
{
    protected APIResponse _response;
    private readonly ITransactionTypeRepository _transactionTypeRepository;
    private readonly IMapper _mapper;
    private readonly IUtilsRepository _utils;
    public TransactionTypeController(ITransactionTypeRepository transactionTypeRepository, IMapper mapper, IFileRepository fileRepository, IUtilsRepository utilsRepository)
    {
        _transactionTypeRepository = transactionTypeRepository;
        _mapper = mapper;
        _response = new();
        _utils = utilsRepository;
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetTransactionTypes(
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
            IEnumerable<TransactionType> transactionTypeList;

            transactionTypeList = await _transactionTypeRepository.GetAllAsync(pageSize: pageSize, pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<TransactionTypeDTO>>(transactionTypeList);
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
    // [HttpGet("{id:int}", Name = "GetTransactionType")]
    // //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status404NotFound)]
    // public async Task<ActionResult<APIResponse>> GetTransactionType(int id)
    // {
    //
    //     var _userId = _utils.GetUserId(Request.Cookies["token"]);
    //     if (String.IsNullOrWhiteSpace(_userId))
    //     {
    //         _response.IsSuccess = false;
    //         _response.StatusCode = HttpStatusCode.Unauthorized;
    //         _response.ErrorMessages = new List<string>()
    //             {
    //                 "You Need To Authorise First"
    //             };
    //         return _response;
    //     }
    //     try
    //     {
    //         if (id == 0)
    //         {
    //             _response.StatusCode = HttpStatusCode.BadRequest;
    //             return BadRequest(_response);
    //         }
    //         var TransactionType = await _transactionTypeRepository.GetAsync(x => x.Id == id);
    //         if (TransactionType == null)
    //         {
    //             _response.StatusCode = HttpStatusCode.BadRequest;
    //             return NotFound(_response);
    //         }
    //
    //         _response.Result = _mapper.Map<TransactionTypeDTO>(TransactionType);
    //
    //         _response.StatusCode = HttpStatusCode.OK;
    //         return Ok(_response);
    //     }
    //     catch (Exception ex)
    //     {
    //         _response.IsSuccess = false;
    //         _response.ErrorMessages = new List<string>() { ex.ToString() };
    //     }
    //     return _response;
    // }
    //
    // [HttpPost]
    // //[Authorize(Roles = "admin")]
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    // public async Task<ActionResult<APIResponse>> CreateTransactionType([FromForm] TransactionTypeCreateDTO createDTO)
    // {
    //
    //     var _userId = _utils.GetUserId(Request.Cookies["token"]);
    //     if (String.IsNullOrWhiteSpace(_userId))
    //     {
    //         _response.IsSuccess = false;
    //         _response.StatusCode = HttpStatusCode.Unauthorized;
    //         _response.ErrorMessages = new List<string>()
    //             {
    //                 "You Need To Authorise First"
    //             };
    //         return _response;
    //     }
    //     try
    //     {
    //         if (createDTO == null)
    //         {
    //             return BadRequest(createDTO);
    //         }
    //         
    //         if (await _transactionTypeRepository.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower()) != null)
    //         {
    //             ModelState.AddModelError("CustomError", "TransactionType already exists");
    //             return BadRequest(ModelState);
    //         }
    //
    //         TransactionType TransactionType = _mapper.Map<TransactionType>(createDTO);
    //
    //         await _transactionTypeRepository.CreateAsync(TransactionType);
    //         await _transactionTypeRepository.SaveAsync();
    //
    //         _response.Result = _mapper.Map<TransactionTypeDTO>(TransactionType);
    //         _response.StatusCode = HttpStatusCode.Created;
    //         return CreatedAtRoute("GetTransactionType", new { id = TransactionType.Id }, _response);
    //     }
    //     catch (Exception ex)
    //     {
    //         _response.IsSuccess = false;
    //         _response.ErrorMessages = new List<string>() { ex.ToString() };
    //     }
    //     return _response;
    // }
    //
    // [HttpDelete("{id:int}", Name = "DeleteTransactionType")]
    // [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status404NotFound)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // //[Authorize(Roles = "admin")]
    // public async Task<ActionResult<APIResponse>> DeleteTransactionType(int id)
    // {
    //
    //     var _userId = _utils.GetUserId(Request.Cookies["token"]);
    //     if (String.IsNullOrWhiteSpace(_userId))
    //     {
    //         _response.IsSuccess = false;
    //         _response.StatusCode = HttpStatusCode.Unauthorized;
    //         _response.ErrorMessages = new List<string>()
    //             {
    //                 "You Need To Authorise First"
    //             };
    //         return _response;
    //     }
    //     try
    //     {
    //         if (id == 0)
    //         {
    //             return BadRequest();
    //         }
    //         var TransactionType = await _transactionTypeRepository.GetAsync(x => x.Id == id);
    //         if (TransactionType == null)
    //         {
    //             return NotFound();
    //         }
    //
    //         await _transactionTypeRepository.RemoveAsync(TransactionType);
    //         _response.StatusCode = HttpStatusCode.NoContent;
    //         _response.IsSuccess = true;
    //         return Ok(_response);
    //     }
    //     catch (Exception ex)
    //     {
    //         _response.IsSuccess = false;
    //         _response.ErrorMessages = new List<string>() { ex.ToString() };
    //     }
    //     return _response;
    // }
    // //[Authorize(Roles = "admin")]
    // [HttpPut("{id:int}", Name = "UpdateTransactionType")]
    // [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // public async Task<ActionResult<APIResponse>> UpdateTransactionType(int id, [FromForm] TransactionTypeUpdateDTO updateDto)
    // {
    //     var _userId = _utils.GetUserId(Request.Cookies["token"]);
    //     if (String.IsNullOrWhiteSpace(_userId))
    //     {
    //         _response.IsSuccess = false;
    //         _response.StatusCode = HttpStatusCode.Unauthorized;
    //         _response.ErrorMessages = new List<string>()
    //             {
    //                 "You Need To Authorise First"
    //             };
    //         return _response;
    //     }
    //
    //     try
    //     {
    //         if(updateDto == null || id != updateDto.Id)
    //         {
    //             return BadRequest();
    //         }
    //
    //         TransactionType TransactionType = _mapper.Map<TransactionType>(updateDto);
    //
    //         await _transactionTypeRepository.UpdateAsync(TransactionType);
    //         _response.StatusCode = HttpStatusCode.NoContent;
    //         _response.IsSuccess = true;
    //         return Ok(_response);
    //     }
    //     catch (Exception ex)
    //     {
    //         _response.IsSuccess= false;
    //         _response.ErrorMessages = new List<string>() { ex.ToString() };
    //     }
    //     return _response;
    // }

}
