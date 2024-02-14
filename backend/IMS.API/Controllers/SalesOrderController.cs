using AutoMapper;
using IMS.DataAccess.Repository.IRepository;
using IMS.Models;
using IMS.Models.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data;
using System.Net;
using Bogus;
using System.Text.Json;

namespace IMS.API.Controllers;

[Route("api/sales-orders")]
[ApiController]
//Deprecated = true
public class SalesOrderController : Controller
{
    protected APIResponse _response;
    private readonly ISalesOrderRepository _dbSalesOrder;
    private readonly IProductRepository _dbProduct;
    private readonly IStockRepository _dbStock;
    private readonly IMapper _mapper;
    private readonly IUtilsRepository _utils;

    public SalesOrderController(
        ISalesOrderRepository dbSalesOrder,
        IProductRepository dbProduct,
        IStockRepository dbStock,
        IMapper mapper,
        IUtilsRepository utils)
    {
        _dbSalesOrder = dbSalesOrder;
        _dbProduct = dbProduct;
        _mapper = mapper;
        _response = new();
        _dbStock = dbStock;
        _utils = utils;
    }

    [HttpGet]
    //[ResponseCache(CacheProfileName = "Default30")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> GetSalesOrders(
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
            IEnumerable<SalesOrder> salesOrderList;

            salesOrderList = await _dbSalesOrder.GetAllAsync(filter: s => s.UserId == _userId,
                                                            pageSize: pageSize,
                                                            pageNumber: pageNumber);

            Pagination pagination = new()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(pagination));

            _response.Result = _mapper.Map<List<SalesOrderDTO>>(salesOrderList);
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
    [HttpGet("{id:int}", Name = "GetSalesOrder")]
    //[ResponseCache(Duration = 30, Location = ResponseCacheLocation.None, NoStore = true)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetSalesOrder(int id)
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
            var salesOrder = await _dbSalesOrder.GetAsync(x => x.Id == id && x.UserId == _userId, includeProperties: "Customer,Product,SalesOrderStatus");
            if (salesOrder == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                return NotFound(_response);
            }

            _response.Result = _mapper.Map<SalesOrder>(salesOrder);
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
    public async Task<ActionResult<APIResponse>> CreateSalesOrder([FromBody] SalesOrderCreateDTO createDTO)
    {
        var userId = _utils.GetUserId(Request.Cookies["token"]);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new APIResponse
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.Unauthorized,
                ErrorMessages = new List<string> { "You need to authorize first." }
            });
        }

        if (createDTO == null)
        {
            return BadRequest("The request body cannot be null.");
        }

        try
        {
            // Ensure the user ID is set for the transaction
            createDTO.UserId = userId;

            // Fetch existing stock and product details
            var stock = await _dbStock.GetAsync(x => x.ProductId == createDTO.ProductId && x.SupplierId == createDTO.SupplierId && x.UserId == userId);
            var product = await _dbProduct.GetAsync(x => x.Id == createDTO.ProductId && x.UserId == userId);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Initialize stock if it does not exist
            if (stock == null)
            {
                stock = new Stock
                {
                    ProductId = product.Id,
                    SupplierId = createDTO.SupplierId ?? 0,
                    UserId = userId,
                    UnitId = 1, // Assuming default UnitId and LocationId
                    LocationId = 1,
                    QtyInStock = 0, // Initialize with 0, will be adjusted below
                    SalesPrice = 0,
                    ValueOnHand = 0,
                    PurchasePrice = 0
                };
            }

            // Adjust stock based on transaction type
            switch (createDTO.TransactionTypeId)
            {
                case 1: // Inbound transaction
                    stock.QtyInStock += createDTO.Quantity;
                    break;
                case 2: // Outbound transaction
                    if (stock.QtyInStock < createDTO.Quantity)
                    {
                        return BadRequest("Insufficient stock quantity.");
                    }
                    stock.QtyInStock -= createDTO.Quantity;
                    break;
                default:
                    return BadRequest("Invalid transaction type.");
            }

            stock.ValueOnHand = stock.QtyInStock * stock.SalesPrice;

            // Update stock
            await _dbStock.UpdateAsync(stock);
            await _dbStock.SaveAsync();

            // Prepare the sales order
            createDTO.Total = stock.PurchasePrice * createDTO.Quantity;
            var salesOrder = _mapper.Map<SalesOrder>(createDTO);
            salesOrder.CustomerId = createDTO.CustomerId == 0 ? null : createDTO.CustomerId;
            salesOrder.SupplierId = createDTO.SupplierId == 0 ? null : createDTO.SupplierId;

            // Save the sales order
            await _dbSalesOrder.CreateAsync(salesOrder);
            await _dbSalesOrder.SaveAsync();

            // Prepare response
            var response = new APIResponse
            {
                Result = _mapper.Map<SalesOrderDTO>(salesOrder),
                StatusCode = HttpStatusCode.Created,
                IsSuccess = true
            };

            return CreatedAtRoute("GetSalesOrder", new { id = salesOrder.Id }, response);
        }
        catch (Exception ex)
        {
            // Log the exception details for debugging
            // Consider using a logging framework or service
            Console.WriteLine(ex); // Placeholder for actual logging

            return StatusCode(500, new APIResponse
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.InternalServerError,
                ErrorMessages = new List<string> { "An error occurred while processing your request." }
            });
        }
    }


    [HttpDelete("{id:int}", Name = "DeleteSalesOrder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<APIResponse>> DeleteSalesOrder(int id)
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
            var salesOrder = await _dbSalesOrder.GetAsync(x => x.Id == id && x.UserId == _userId);
            if (salesOrder == null)
            {
                return NotFound();
            }

            await _dbSalesOrder.RemoveAsync(salesOrder);
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
    [HttpPut("{id:int}", Name = "UpdateSalesOrder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> UpdateSalesOrder(int id, [FromBody] SalesOrderUpdateDTO updateDto)
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
            
            SalesOrder salesOrder = _mapper.Map<SalesOrder>(updateDto);

            await _dbSalesOrder.UpdateAsync(salesOrder);
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
