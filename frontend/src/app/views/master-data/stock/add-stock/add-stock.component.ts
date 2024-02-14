import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { Unit } from '@app/_shared/models/master-data/unit.model';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { Location } from '@app/_shared/models/master-data/location.model';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent {
  addStockForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  
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
    private supplierService: SupplierService,
    private stockService: StockService,
    private locationService: LocationService,
    private werehouseService: WarehouseService,
    private standService: StandService,
    private router: Router
  ) {}
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


    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();

  }

  createForm() {
    this.addStockForm = this.formBuilder.group({
      productId: ['', [Validators.required]],
      unitId: ['', [Validators.required]],
      supplierId: [''],
      purchasePrice: ['', [Validators.required]],
      salesPrice: ['', [Validators.required]],
      valueOnHand: [''],
      qtyInStock: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addStockForm.controls);
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


  onReset() {
    this.submitted = false;
    this.addStockForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addStockForm.status === 'VALID';
    console.log(this.addStockForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addStockForm.value);
    if (this.onValidate()) {
      this.messages = [];
      // TODO: Submit form value
      console.warn(this.addStockForm.value);

      // debugger;
      const frmData: Stock = Object.assign(this.addStockForm.value);
      frmData.valueOnHand = frmData.qtyInStock * frmData.salesPrice

      
      
      this.stockService.createStock(frmData).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            debugger;
            // alert('SUCCESS!');
            this.router.navigateByUrl('/master-data/stocks').then(() => {
              debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully added the Stock');
              this.visible = true;
            });
          }
        },
        error: (error: any) => {
          this.toastrColor = 'danger';
          this.visible = true;
          if (error.error.CustomError) {
            this.messages.push(error.error.CustomError);
          } else {
            if (error.error.errors) {
              this.messages = error.error.errors;
            } else {
              this.messages.push(error.error);
            }
          }
        },
      });
    }
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
}