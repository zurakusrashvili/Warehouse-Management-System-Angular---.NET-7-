import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { SalesOrderService } from 'src/app/_shared/services/sales-order.service';
import { ProductService } from '@app/_shared/services/product.service';
import { Product } from '@app/_shared/models/master-data/product.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { TransactionTypeService } from '@app/_shared/services/transaction-type.service';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { TransactionType } from '@app/_shared/models/master-data/transaction-type.model';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { StockService } from '@app/_shared/services/stock.service';


@Component({
  selector: 'app-add-sales-order',
  templateUrl: './add-sales-order.component.html',
  styleUrls: ['./add-sales-order.component.scss'],
})
export class AddSalesOrderComponent {
  addForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  stocks: Stock[] = [];

  products: Product[] = [];
  customers: Customer[] = [];
  suppliers: Supplier[] = [];
  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;
  transactionTypes: TransactionType[] = []
  chosenTransactionTypeId: number = 1

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private router: Router,
    private supplierService: SupplierService,
    private transactionTypeService: TransactionTypeService,
    private stockService: StockService
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.getTransactionTypes();
    this.getProducts();
    this.getCustomers();
    this.getSuppliers();
    this.getStocks();
    this.buildForm();
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

  buildForm() {
    this.addForm = this.formBuilder.group({
      productId: ['', [Validators.required]],
      customerId: [''],
      supplierId: [''],
      quantity: ['', [Validators.required]],
      transactionTypeId: [this.chosenTransactionTypeId, [Validators.required]],
      orderDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ]
    });
    this.formControls = Object.keys(this.addForm.controls);
    this.addForm.get('productId')!.valueChanges.subscribe(productId => {
      // Find the stock with the matching productId
      let stock = this.stocks.find(s => s.productId === productId);
      if (stock) {
        // If a matching stock is found, update the supplierId form control
        this.addForm.patchValue({
          supplierId: stock.supplierId
        });
      } else {
        // If no matching stock is found, you can decide to clear the supplierId or leave it as is
        this.addForm.patchValue({
          supplierId: '' // or null or any default value
        });
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.addForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    console.log(this.addForm);
    return this.addForm.status === 'VALID';
  }
  _price: number = 0;
  onChangeQty(event: any) {
    // this.getPrice(this.addForm.controls['productId'].value);
    // const input = parseFloat(event.target.value).toFixed(2);

    // const subtotalNum = Number(input) * Number(this._price);
    // // debugger;
    // const taxNum = subtotalNum * 0.1;
    // const tax = parseFloat(taxNum.toString()).toFixed(2);

    // const totalNum = subtotalNum - taxNum;
    // const total = parseFloat(totalNum.toString()).toFixed(2);
    // this.addForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }

  onTransactionTypeChange(event: any){
    this.chosenTransactionTypeId = event.target.value.split(":")[0];
    console.log(this.chosenTransactionTypeId)
  }
  onChangeProduct(event: any) {
    // this.getSalesQty(this.addForm.controls['productId'].value);
    // const input = parseFloat(event.target.value).toFixed(2);

    // const subtotalNum = Number(input) * Number(this._price);
    // // debugger;
    // const taxNum = subtotalNum * 0.1;
    // const tax = parseFloat(taxNum.toString()).toFixed(2);

    // const totalNum = subtotalNum - taxNum;
    // const total = parseFloat(totalNum.toString()).toFixed(2);
    // this.addForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }

  getPrice(productId: number): any {
    this.productService.getProduct(productId).subscribe({
      next: (response: any) => {
        this._price = response.result.salesPrice;

        return response.result.salesPrice;
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
      complete() {},
    });
  }
  getSalesQty(productId: number): any {
    this.productService.getProduct(productId).subscribe({
      next: (response: any) => {
        this._price = response.result.salesQty;

        return response.result.salesPrice;
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
      complete() {},
    });
  }
  onChangeOrderDate(event: any) {}
  onChangeSubtotal(event: any) {}
  onChangeTax(event: any) {}
  onChangeTotal(event: any) {}
  onSubmit() {
    this.messages = [];
    console.warn(this.onValidate(), this.addForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addForm.value);
      debugger;
      this.salesOrderService.createSalesOrder(this.addForm.value).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router.navigateByUrl('/sales-order').then(() => {
              debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully added the salesOrder');
              this.visible = true;
            });
          }
        },
        error: (error: any) => {
          debugger;
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

  getTransactionTypes() {
    this.transactionTypeService.getAllTransactionTypes().subscribe({
      next: (response: any) => {
        this.transactionTypes = response.result;
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
}
