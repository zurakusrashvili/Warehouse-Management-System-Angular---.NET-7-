import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { Location } from '@app/_shared/models/master-data/location.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { Unit } from '@app/_shared/models/master-data/unit.model';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { LocationService } from '@app/_shared/services/location.service';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { ProductService } from '@app/_shared/services/product.service';
import { StandService } from '@app/_shared/services/stand.service';
import { StockService } from '@app/_shared/services/stock.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { UnitService } from '@app/_shared/services/unit.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';

@Component({
  selector: 'app-edit-delete-stock',
  templateUrl: './edit-delete-stock.component.html',
  styleUrls: ['./edit-delete-stock.component.scss']
})
export class EditDeleteStockComponent implements OnInit{

  editStockForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];

  stockId!: number;
  messages: string[] = [];
  

  editPage: boolean = true;


  products: Product[] = [];
  stocks: Stock[] = [];
  units: Unit[] = []
  suppliers: Supplier[] = []

  categories: ProductCategory[] = [];
  subcategories: Subcategory[] = [];

  warehouses: Warehouse[] = []
  stands: Stand[] = []
  locations: Location[] = []
  stock!: Stock;

  colorButton: string = '';
  pageSize: number = 5;
  pageNumber: number = 1;

    // toastr
    toastrColor: string = '';
    position = 'top-end';
    visible = false;

constructor(
  private formBuilder: FormBuilder,
  public validationFormsService: ValidationFormsService,
  private productService: ProductService,
  private categoryService: ProductCategoryService,
  private subcategoryService: SubcategoryService,
  private unitService: UnitService,
  private activatedRoute: ActivatedRoute,
  private supplierService: SupplierService,
  private stockService: StockService,
  private locationService: LocationService,
  private werehouseService: WarehouseService,
  private standService: StandService,
  private router: Router
) {
  this.formErrors = this.validationFormsService.errorMessages;
}

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
  
  this.getPageType();

  this.initializeForm();
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
  return locationName
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







  buildForm() {
    this.editStockForm = this.formBuilder.group({
      productId: [this.stock.productId, [Validators.required]],
      unitId: [this.stock.unitId, [Validators.required]],
      supplierId: [this.stock.supplierId],
      purchasePrice: [this.stock.purchasePrice, [Validators.required]],
      salesPrice: [this.stock.salesPrice, [Validators.required]],
      valueOnHand: [this.stock.valueOnHand],
      qtyInStock: [this.stock.qtyInStock, [Validators.required]],
      locationId: [this.stock.locationId, [Validators.required]],
    });
    this.formControls = Object.keys(this.editStockForm.controls);
    //false for delete page
    if (this.editPage == false) {
      this.editStockForm.get('productId')?.disable();
      this.editStockForm.get('unitId')?.disable();
      this.editStockForm.get('supplierId')?.disable();
      this.editStockForm.get('purchasePrice')?.disable();
      this.editStockForm.get('salesPrice')?.disable();
      this.editStockForm.get('qtyInStock')?.disable();
      this.editStockForm.get('locationId')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editStockForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editStockForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editStockForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editStockForm.value);

      if (this.editPage) {
        //Edit page
        debugger;
        var frmData: Stock = Object.assign(this.editStockForm.value);
        frmData.valueOnHand = frmData.qtyInStock * frmData.salesPrice
frmData.id = this.stockId
        this.stockService
          .updateStock(frmData)
          .subscribe({
            next: (response: any) => {
              // debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully edited the stock');
              this.router.navigateByUrl('/master-data/stocks');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.messages = error.error.errors;
              } else {
                this.messages.push(error.error);
              }
            },
          });
      }

      // Delete Page
      else {
        this.stockService
          .deleteStock(this.editStockForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.messages.push('Successfully deleted the stock');
              this.router.navigateByUrl('/master-data/stocks');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.messages = error.error.errors;
              } else {
                this.messages.push(error.error);
              }
            },
          });
      }
    }
  }

  initializeForm() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.stockId = Number(paramMap.get('id'));
      this.stockService.getStock(this.stockId).subscribe({
        next: async (response: any) => {
          this.stock = await response.result;
          // this._salesPrice = this.stock.salesPrice;
          // this._qtyInStock = this.stock.qtyInStock;

          
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }

  getPageType() {
    let title = this.activatedRoute.snapshot.data['title'];
    // debugger;
    if (title == 'Delete Product') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }
}
