using IMS.Models;
using IMS.Models.Authentication;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IMS.DataAccess
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }


        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<Stand> Stands { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        public DbSet<TransactionType> TransactionTypes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Product>()
                .HasOne(p => p.Subcategory)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.SubcategoryId)
                .OnDelete(DeleteBehavior.NoAction);


            builder.Entity<TransactionType>().HasData(
                new TransactionType()
                {
                    Id = 1,
                    Name = "Inbound",
                },
                
                new TransactionType()
                {
                    Id = 2,
                    Name = "Outbound"
                }                
            );
            builder.Entity<Warehouse>().HasData(
                new Warehouse()
                {
                    Id = 1,
                    Name = "Unknown",
                    Address = "Unknown",
                    PhoneNumber = "Unknown",
                    UserId = "1"
                });

            builder.Entity<Location>().HasData(
                new Location()
                {
                    Id = 1,
                    UserId = "1",
                    PlaceNumber = 0,
                    ShelfNumber = 0,
                    StandId = 1
                }
            );

            builder.Entity<Stand>().HasData(
                new Stand()
                {
                    Id = 1,
                    UserId = "1",
                    StandName = "Unknown",
                    WarehouseId = 1
                });

            builder.Entity<Unit>().HasData(
                new Unit()
                {
                    Id = 1,
                    Name = "GRAM"
                },
                new Unit()
                {
                    Id =2,
                    Name = "KG"
                },
                new Unit()
                {
                    Id = 3,
                    Name = "POUND"
                },
                new Unit()
                {
                    Id = 4,
                    Name = "CM"
                },
                new Unit()
                {
                    Id = 5,
                    Name = "METER"
                },
                new Unit()
                {
                    Id = 6,
                    Name = "ENTITY"
                }
            );
            base.OnModelCreating(builder);

        }

    }
}