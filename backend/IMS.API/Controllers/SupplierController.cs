using AutoMapper;
using IMS.DataAccess;
using IMS.Models;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using IMS.DataAccess.Repository.IRepository;
using System.Text.Json;
using IMS.Models.DTO.Supplier;

namespace IMS.API.Controllers
{
    [Route("api/suppliers")]
    [ApiController]
    public class SupplierController : Controller
    {
        private readonly ISupplierRepository _dbSupplier;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly IUtilsRepository _utils;

        public SupplierController(ISupplierRepository dbSupplier, IMapper mapper, IUtilsRepository utilsRepository)
        {
            _dbSupplier = dbSupplier;
            _mapper = mapper;
            _response = new();
            _utils = utilsRepository;
        }

        [HttpGet]
        //[ResponseCache(CacheProfileName = "Default30")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> GetSuppliers(
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
                IEnumerable<Supplier> supplierList;

                supplierList = await _dbSupplier.GetAllAsync(filter: c => c.UserId == _userId, pageSize: pageSize, pageNumber: pageNumber);

                Pagination pagination = new()
                {
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                };

                Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

                _response.Result = _mapper.Map<List<SupplierDTO>>(supplierList);
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
        [HttpGet("{id:int}", Name = "GetSupplier")]
        //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> GetSupplier(int id)
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
                var supplier = await _dbSupplier.GetAsync(x => x.Id == id && x.UserId == _userId);
                if (supplier == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return NotFound(_response);
                }

                _response.Result = _mapper.Map<Supplier>(supplier);
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
        public async Task<ActionResult<APIResponse>> CreateSupplier([FromBody] SupplierCreateDTO createDTO)
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
                if (await _dbSupplier.GetAsync(x => x.Name.ToLower() == createDTO.Name.ToLower() && x.UserId == _userId) != null)
                {
                    ModelState.AddModelError("CustomError", "Supplier already exists");
                    return BadRequest(ModelState);
                }

                if (createDTO == null)
                {
                    return BadRequest(createDTO);
                }

                Supplier supplier = _mapper.Map<Supplier>(createDTO);

                await _dbSupplier.CreateAsync(supplier);
                await _dbSupplier.SaveAsync();

                _response.Result = _mapper.Map<SupplierDTO>(supplier);
                _response.StatusCode = HttpStatusCode.Created;
                //return CreatedAtRoute("GetSupplier", new { id = supplier.Id }, _response);
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
            }
            return _response;
        }

        [HttpDelete("{id:int}", Name = "DeleteSupplier")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        //[Authorize(Roles = "admin")]
        public async Task<ActionResult<APIResponse>> DeleteSupplier(int id)
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
                var supplier = await _dbSupplier.GetAsync(x => x.Id == id && x.UserId == _userId);
                if (supplier == null)
                {
                    return NotFound();
                }

                await _dbSupplier.RemoveAsync(supplier);
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
        [HttpPut("{id:int}", Name = "UpdateSupplier")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> UpdateSupplier(int id, [FromBody] SupplierUpdateDTO updateDto)
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
                if (updateDto == null || id != updateDto.Id)
                {
                    return BadRequest();
                }
                updateDto.UserId = _userId;
                Supplier supplier = _mapper.Map<Supplier>(updateDto);

                await _dbSupplier.UpdateAsync(supplier);
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
    }
}
