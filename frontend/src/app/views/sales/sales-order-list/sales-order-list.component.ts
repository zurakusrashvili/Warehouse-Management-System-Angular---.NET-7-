import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '@app/_shared/services/sales-order.service';
import { ProductService } from '@app/_shared/services/product.service';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { SalesOrder } from '@models/master-data/sales-order.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { StockService } from '@app/_shared/services/stock.service';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { TransactionTypeService } from '@app/_shared/services/transaction-type.service';
import { TransactionType } from '@app/_shared/models/master-data/transaction-type.model';
@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
})
export class SalesOrderListComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  products: Product[] = []
  stocks: Stock[] = []
  customers: Customer[] = []
  suppliers: Supplier[] = []
  transactionTypes: TransactionType[] = []

  constructor(
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private stockService: StockService,
    private customerService: CustomerService,
    private supplierService: SupplierService,
    private transactionTypeService: TransactionTypeService
  ) { }
  ngOnInit(): void {
    this.getAllSalesOrders();
    this.getAllProducts();
    this.getAllStock();
    this.getAllCustomers();
    this.getAllSuppliers();
    this.getAllTransactionTypes();
  }
  getAllTransactionTypes(){
    this.transactionTypeService.getAllTransactionTypes().subscribe({
      next: async (response: any) => {
        this.transactionTypes = await response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  getAllSalesOrders() {
    this.salesOrderService.getAllSalesOrders().subscribe({
      next: async (response: any) => {
        this.salesOrders = await response.result;
        console.log(this.salesOrders)
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  getAllStock() {
    this.stockService.getAllstocks().subscribe({
      next: async (response: any) => {
        this.stocks = await response.result;
        console.log(this.stocks)
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: async (response: any) => {
        this.products = await response.result;

      },
      error: (err: any) => {
        console.log(err);
      },
    })
  }


  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: async (response: any) => {
        this.customers = await response.result;

      },
      error: (err: any) => {
        console.log(err);
      },
    })
  }


  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: async (response: any) => {
        this.suppliers = await response.result;

      },
      error: (err: any) => {
        console.log(err);
      },
    })
  }

  getProductName(productId: any) {
    return this.products.find(c => c.id === productId)?.name
  }

  getSupplierName(Id: any) {
    return this.suppliers.find(c => c.id === Id)?.name
  }

  getCustomerName(Id: any) {
    return this.customers.find(c => c.id === Id)?.name
  }
  getTransactionTypeName(Id: any) {
    return this.transactionTypes.find(c => c.id === Id)?.name
  }
}
