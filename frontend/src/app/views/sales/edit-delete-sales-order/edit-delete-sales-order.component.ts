import { devOnlyGuardedExpression } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { SalesOrder } from '@app/_shared/models/master-data/sales-order.model';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { ProductService } from '@app/_shared/services/product.service';
import { SalesOrderService } from '@app/_shared/services/sales-order.service';
import { StockService } from '@app/_shared/services/stock.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { BehaviorSubject } from 'rxjs';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';

@Component({
  selector: 'app-edit-delete-sales-order',
  templateUrl: './edit-delete-sales-order.component.html',
  styleUrls: ['./edit-delete-sales-order.component.scss'],
})
export class EditDeleteSalesOrderComponent {
  editForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  products: Product[] = [];
  customers: Customer[] = [];
  salesOrderId: number = 0;
  salesOrder!: SalesOrder;
  editPage: boolean = true;
  colorButton: string = '';
  productStock: Stock = {
    id: 0,
    locationId: 0,
    location: {
      id: 0,
      standId: 0,
      shelfNumber: 0,
      placeNumber: 0,
      userId: '',
      stocks: []
    },
    productId: 0,
    product: {
      id: 0,
      name: '',
      description: '',
      imageName: '',
      productCategoryId: 0,
      subcategoryId: 0,
      imageFile: undefined
    },
    productUnit: {
      id: 0,
      name: ''
    },
    purchasePrice: 0,
    qtyInStock: 0,
    salesPrice: 0,
    supplier: {
      id: 0,
      name: '',
      address: '',
      phoneNumber: '',
      userId: ''
    },
    supplierId: 0,
    unitId: 0,
    userId: '',
    valueOnHand: 0
  };
  // toastr
  toastrColor: string = '';
  position = 'top-end';
  suppliers: Supplier[] = [];
  visible = false;
  _price: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private stockService: StockService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {
    this.formErrors = this.validationFormsService.errorMessages;

    this.getPageType();
    this.getSalesOrder();
    this.getProducts();
    this.getCustomers();
    this.getSuppliers();
  }
  getPageType() {
    let title = this.activatedRoute.snapshot.data['title'];
    if (title == 'Delete Sales Order') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }
  getProductStock() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (this.salesOrder) {
        this.stockService.getAllstocks().subscribe({
          next: (response: any) => {
            let productStocks = response.result as Stock[]

            this.productStock = productStocks.find(s => s.productId == this.salesOrder.productId) as Stock;
          },
          error: (error: any) => {
            console.log(error);
          },
          complete() { },
        });
      }

    });
  }
  getSalesOrder() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.salesOrderId = Number(paramMap.get('id'));
      this.salesOrderService.getSalesOrder(this.salesOrderId).subscribe({
        next: (response: any) => {
          this.salesOrder = response.result;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
        complete() { },
      });
    });
  }
  buildForm() {
    this.editForm = this.formBuilder.group({
      id: [this.salesOrder.id],
      productId: [this.salesOrder.productId, [Validators.required]],
      customerId: [this.salesOrder.customerId],
      supplierId: [this.salesOrder.supplierId],
      quantity: [this.salesOrder.quantity, [Validators.required]],
      transactionTypeId: [this.salesOrder.transactionTypeId, [Validators.required]],
      orderDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      total: [
        parseFloat(this.salesOrder.total.toString()),
        [Validators.required],
      ],
    });
    this.formControls = Object.keys(this.editForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editForm.get('productId')?.disable();
      this.editForm.get('quantity')?.disable();
      this.editForm.get('orderDate')?.disable();
      this.editForm.get('transactionTypeId')?.disable();
      this.editForm.get('customerId')?.disable();
      this.editForm.get('supplierId')?.disable();
      this.editForm.get('total')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editForm.status === 'VALID';
    console.log(this.editForm);
  }

  onChangeQty(event: any) {
    // debugger;
    this.getPrice(this.editForm.controls['productId'].value);
    const input = parseFloat(event.target.value).toFixed(2);

    const subtotalNum = Number(input) * Number(this._price);
    // debugger;
    const taxNum = subtotalNum * 0.1;
    const tax = parseFloat(taxNum.toString()).toFixed(2);

    const totalNum = subtotalNum - taxNum;
    const total = parseFloat(totalNum.toString()).toFixed(2);
    this.editForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }
  onChangeProduct(event: any) {
    // debugger;

    const input = parseFloat(event.target.value);
    this.getSalesQty(input);
    const quantity = this.editForm.get(['quantity'])?.value;
    const subtotalNum = Number(quantity) * Number(this._price);
    // debugger;
    const taxNum = subtotalNum * 0.1;
    const tax = parseFloat(taxNum.toString()).toFixed(2);

    const totalNum = subtotalNum - taxNum;
    const total = parseFloat(totalNum.toString()).toFixed(2);
    this.editForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }

  getPrice(productId: number): any {
    return this.productStock.salesPrice
  }
  getSalesQty(productId: number): any {
    let returnQty = 0
    if (this.productStock) {
      returnQty = this.salesOrder.quantity
    }
    return returnQty;
  }

  onChangeOrderDate(event: any) { }
  onChangeSubtotal(event: any) { }
  onChangeTax(event: any) { }
  onChangeTotal(event: any) { }
  onSubmit() {
    this.messages = [];
    console.warn(this.onValidate(), this.editForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.editForm.value);

      // debugger;
      if (this.editPage) {
        this.salesOrderService.updateSalesOrder(this.editForm.value).subscribe({
          next: (response: any) => {
            if (response.isSuccess == true || response.statusCode == 201) {
              // alert('SUCCESS!');
              // debugger;
              this.router.navigateByUrl('/sales-order').then(() => {
                // debugger;
                this.toastrColor = 'success';
                this.messages.push('Successfully added the Sales Order');
                this.visible = true;
              });
            }
          },
          error: (error: any) => {
            // debugger;
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
      // Delete Page
      else {
        this.salesOrderService.deleteSalesOrder(this.editForm.value).subscribe({
          next: (response: any) => {
            this.toastrColor = 'success';
            this.messages.push('Successfully deleted the Sales Order');
            this.router.navigateByUrl('/sales-order');
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

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.result;
      },
      error: (error: any) => {
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
  getCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (response: any) => {
        this.customers = response.result;
      },
      error: (error: any) => {
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

  getSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (response: any) => {
        this.suppliers = response.result;
      },
      error: (error: any) => {
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
  // getSOStatus() {
  //   this.salesOrderStatusService.getAllSalesOrderStatus().subscribe({
  //     next: (response: any) => {
  //       this.soStatuses = response.result;
  //     },
  //     error: (error: any) => {
  //       if (error.error.CustomError) {
  //         this.messages.push(error.error.CustomError);
  //       } else {
  //         if (error.error.errors) {
  //           this.messages = error.error.errors;
  //         } else {
  //           this.messages.push(error.error);
  //         }
  //       }
  //     },
  //   });
  // }
}
