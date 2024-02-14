using AutoMapper;
using IMS.Models;
using IMS.Models.DTO.Customer;
using IMS.Models.DTO.Location;
using IMS.Models.DTO.Product;
using IMS.Models.DTO.ProductCategory;
using IMS.Models.DTO.SalesOrderStatus;
using IMS.Models.DTO.Stand;
using IMS.Models.DTO.Stock;
using IMS.Models.DTO.Subcategory;
using IMS.Models.DTO.Supplier;
using IMS.Models.DTO.TransactionType;
using IMS.Models.DTO.Unit;
using IMS.Models.DTO.Warehouse;

namespace IMS.API.Mapper
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            // Branch
            //CreateMap<Branch, BranchDTO>();
            //CreateMap<BranchDTO, Branch>();

            //CreateMap<Branch, BranchCreateDTO>().ReverseMap();
            //CreateMap<Branch, BranchUpdateDTO>().ReverseMap();

            // Customer
            CreateMap<Customer, CustomerDTO>();
            CreateMap<CustomerDTO, Customer>();

            CreateMap<Customer, CustomerCreateDTO>().ReverseMap();
            CreateMap<Customer, CustomerUpdateDTO>().ReverseMap();
            
            // Location
            CreateMap<Location, LocationDTO>();
            CreateMap<LocationDTO, Customer>();

            CreateMap<Location, LocationCreateDTO>().ReverseMap();
            CreateMap<Location, LocationUpdateDTO>().ReverseMap();

            //Product Category
            CreateMap<ProductCategory, ProductCategoryDTO>();
            CreateMap<ProductCategoryDTO, ProductCategory>();

            CreateMap<ProductCategory, ProductCategoryCreateDTO>().ReverseMap();
            CreateMap<ProductCategory, ProductCategoryUpdateDTO>().ReverseMap();

            //Unit
            CreateMap<Unit, UnitDTO>();
            CreateMap<UnitDTO, Unit>();

            CreateMap<Unit, UnitCreateDTO>().ReverseMap();
            CreateMap<Unit, UnitUpdateDTO>().ReverseMap();

            //Product
            CreateMap<Product, ProductDTO>();
            CreateMap<ProductDTO, Product>();

            CreateMap<Product, ProductCreateDTO>().ReverseMap();
            CreateMap<Product, ProductUpdateDTO>().ReverseMap();

            //Sales Order
            CreateMap<SalesOrder, SalesOrderDTO>();
            CreateMap<SalesOrderDTO, SalesOrder>();

            CreateMap<SalesOrder, SalesOrderCreateDTO>().ReverseMap();
            CreateMap<SalesOrder, SalesOrderUpdateDTO>().ReverseMap();
            //Stand
            CreateMap<Stand, StandDTO>();
            CreateMap<StandDTO, Stand>();

            CreateMap<Stand, StandCreateDTO>().ReverseMap();
            CreateMap<Stand, StandUpdateDTO>().ReverseMap();
            
            //Subcategory
            CreateMap<Subcategory, SubcategoryDTO>();
            CreateMap<SubcategoryDTO, Subcategory>();

            CreateMap<Subcategory, SubcategoryCreateDTO>().ReverseMap();
            CreateMap<Subcategory, SubcategoryUpdateDTO>().ReverseMap();
            
            //Supplier
            CreateMap<Supplier, SupplierDTO>();
            CreateMap<SupplierDTO, Supplier>();

            CreateMap<Supplier, SupplierCreateDTO>().ReverseMap();
            CreateMap<Supplier, SupplierUpdateDTO>().ReverseMap();
            
            //Transaction Type
            CreateMap<TransactionType, TransactionTypeDTO>();
            CreateMap<TransactionTypeDTO, TransactionType>();

            CreateMap<TransactionType, TransactionTypeCreateDTO>().ReverseMap();
            CreateMap<TransactionType, TransactionTypeUpdateDTO>().ReverseMap();
            
            //Warehouse
            CreateMap<Warehouse, WarehouseDTO>();
            CreateMap<WarehouseDTO, Warehouse>();

            CreateMap<Warehouse, WarehouseCreateDTO>().ReverseMap();
            CreateMap<Warehouse, WarehouseUpdateDTO>().ReverseMap();



            //Stock
            CreateMap<Stock, StockDTO>();
            CreateMap<StockDTO, Stock>();

            CreateMap<Stock, StockCreateDTO>().ReverseMap();
            CreateMap<Stock, StockUpdateDTO>().ReverseMap();
        }
    }
}
