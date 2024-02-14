import { Component } from '@angular/core';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { ProductService } from '@app/_shared/services/product.service';
import { StockService } from '@app/_shared/services/stock.service';
import { UnitService } from '@app/_shared/services/unit.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { environment } from '@environment/environment.development';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { Unit } from '@app/_shared/models/master-data/unit.model';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { Location } from '@app/_shared/models/master-data/location.model';
import { StandService } from '@app/_shared/services/stand.service';
import { LocationService } from '@app/_shared/services/location.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { Stand } from '@app/_shared/models/master-data/Stand.model';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent {
  imageBaseUrl = environment.appUrl + '/uploads/';
  products: Product[] = [];
  stocks: Stock[] = [];
  units: Unit[] = []
  suppliers: Supplier[] = []
  categories: ProductCategory[] = [];
  subcategories: Subcategory[] = [];


  warehouses: Warehouse[] = []
  stands: Stand[] = []
  locations: Location[] = []

  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private productService: ProductService,
    private categoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService,
    private unitService: UnitService,
    private supplierService: SupplierService,
    private stockService: StockService,
    private locationService: LocationService,
    private werehouseService: WarehouseService,
    private standService: StandService
  ) { }
  ngOnInit(): void {
    this.getAllProducts();
    // this.getCategories();
    // this.getSubcategories();
    this.getStocks();
    this.getSuppliers();
    this.getUnits();

    this.getLocations();
    this.getStands();
    this.getWarehouses();
  }
  getProductImagename(productId: any) {
    return this.products.find(p => p.id == productId)?.imageName
  }
  getAllProducts() {
    // debugger;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  getProduct(productId: any) {
    return this.products.find(p => p.id == productId)
  }

  getCategoryName(product: Product) {
    return this.categories.find(c => c.id === product.productCategoryId)?.name
  }
  getUnitName(stock: Stock) {
    return this.units.find(u => u.id == stock.unitId)?.name;
  }

  getSubcategoryName(product: Product) {
    return this.subcategories.find(c => c.id === product.subcategoryId)?.name
  }

  getSupplierName(id: any) {
    return this.suppliers.find(s => s.id == id)?.name
  }



  getCategories() {
    // debugger;
    this.categoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.categories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getLocations() {
    // debugger;
    this.locationService.getAllLocations().subscribe({
      next: (response: any) => {
        this.locations = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getStands() {
    // debugger;
    this.standService.getAllStands().subscribe({
      next: (response: any) => {
        this.stands = response.result;
        console.log(response.result, "Stands")
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getWarehouses() {
    // debugger;
    this.werehouseService.getAllWarehouses().subscribe({
      next: (response: any) => {
        this.warehouses = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }


  // let locationName = `${warehouse?.name}/${stand?.standName}/${location?.shelfNumber}/${location?.placeNumber}`
  // return locationName;

  getLocation(locationId: any) {
    return this.locations.find(l => l.id == locationId)
  }

  getStand(location: Location) {
    return this.stands.find(s => s.id == location?.standId)
  }
  getWarehouse(stand: Stand) {
    return this.warehouses.find(w => w.id == stand?.warehouseId)
  }

  createLocationName(locationId: any) {
    let location = this.getLocation(locationId) as Location
    let stand = this.getStand(location) as Stand
    let warehouse = this.getWarehouse(stand) as Warehouse

    let locationName = `${warehouse?.name}/${stand?.standName}/${location?.shelfNumber}/${location?.placeNumber}`
    return locationName;
  }



  getSuppliers() {
    // debugger;
    this.supplierService.getAllSuppliers().subscribe({
      next: (response: any) => {
        this.suppliers = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }



  getUnits() {
    // debugger;
    this.unitService.getAllUnits().subscribe({
      next: (response: any) => {
        this.units = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getStocks() {
    // debugger;
    this.stockService.getAllstocks().subscribe({
      next: (response: any) => {
        this.stocks = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }


  getSubcategories() {
    // debugger;
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response: any) => {
        this.subcategories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
