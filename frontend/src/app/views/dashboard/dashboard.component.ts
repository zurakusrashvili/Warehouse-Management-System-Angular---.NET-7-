import { Component, OnInit } from '@angular/core';
import { Product } from '@app/_shared/models/master-data/product.model';
import { SalesOrder } from '@app/_shared/models/master-data/sales-order.model';
import { Stock } from '@app/_shared/models/master-data/stock.model';
import { ProductService } from '@app/_shared/services/product.service';
import { SalesOrderService } from '@app/_shared/services/sales-order.service';
import { StockService } from '@app/_shared/services/stock.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  soCount: number = 0;
  totalSales: number = 0;
  totalSalesBought: number = 0;
  totalSalesSold: number = 0;

  products: Product[] = [];
  stock: Stock[] = [];
  productCount: number = 0;
  totalProductValue: number = 0;

  constructor(
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private stockService: StockService
  ) { }
  ngOnInit(): void {
    this.getAllSalesOrders();
    this.getProducts();
    this.getStock();
  }

  async populateSalesVariables() {
    // Get total sales count
    this.soCount = this.salesOrders.length;

    // Get total sales
    this.totalSales = this.salesOrders
      .filter(sales => sales.transactionTypeId != 0)
      .map((sales) => Number.parseFloat(sales.total.toString()))
      .reduce((acc, curr) => acc + curr, 0);
      


    // Get total Paid Sales
    this.totalSalesSold = this.salesOrders
      .filter((sales) => sales.transactionTypeId == 2)
      .map((sales) => Number.parseFloat(sales.total.toString()))
      .reduce((acc, curr) => acc + curr, 0);

    // // Get total Paid Sales
    this.totalSalesBought = this.salesOrders
      .filter((sales) => sales.transactionTypeId == 1)
      .map((sales) => Number.parseFloat(sales.total.toString()))
      .reduce((acc, curr) => acc + curr, 0);

  }



  async populateProductsVariables() {
    // Get total products
    this.productCount = this.products.length;


    
  }

  async populateStockVaiables() {
// // Get total valueOnHand
    this.totalProductValue = this.stock
      .map((stock) => Number.parseFloat(stock.valueOnHand.toString()))
      .reduce((acc, curr) => acc + curr, 0);
  }

  getAllSalesOrders() {
    this.salesOrderService.getAllSalesOrders().subscribe({
      next: async (response: any) => {
        let sales:SalesOrder[] = await response.result
        this.salesOrders = sales.filter(sale => sale.transactionTypeId != 0)
        console.log(sales, this.salesOrders)
        this.populateSalesVariables();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getProductQuantity(product: Product){
   return this.stock
        .filter(s => s.productId == product.id)
        .map((stock) => Number.parseFloat(stock.qtyInStock.toString()))
        .reduce((acc, curr) => acc + curr, 0);
  }


  getStock() {
    this.stockService.getAllstocks().subscribe({
      next: async (response: any) => {
        this.stock = await response.result;
        console.log(response.result)
        this.populateStockVaiables();
      },
      error: (error: any) =>{
        console.log(error)
      }
    })
  }

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: async (response: any) => {
        this.products = await response.result;
        this.populateProductsVariables();
      },
      error: (error: any) => {
        console.log(error);
      },
      complete() {

      }
    });
  }
}
