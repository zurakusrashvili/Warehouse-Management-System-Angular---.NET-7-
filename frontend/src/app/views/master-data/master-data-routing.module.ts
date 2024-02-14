import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FloatingLabelsComponent } from './floating-labels/floating-labels.component';
import { InputGroupsComponent } from './input-groups/input-groups.component';
import { RangesComponent } from './ranges/ranges.component';
import { SelectComponent } from './select/select.component';

import { LayoutComponent } from './layout/layout.component';
import { ValidationComponent } from './validation/validation.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { EditDeleteCustomerComponent } from './customer/edit-delete-customer/edit-delete-customer.component';
import { ProductCategoryListComponent } from './product-category/product-category-list/product-category-list.component';
import { AddProductCategoryComponent } from './product-category/add-product-category/add-product-category.component';
import { EditDeleteProductCategoryComponent } from './product-category/edit-delete-product-category/edit-delete-product-category.component';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { EditDeleteCompanyComponent } from './company/edit-delete-company/edit-delete-company.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { EditDeleteProductComponent } from './product/edit-delete-product/edit-delete-product.component';
import { AddProductSubcategoryComponent } from './product-subcategory/add-product-subcategory/add-product-subcategory.component';
import { EditDeleteProductSubcategoryComponent } from './product-subcategory/edit-delete-product-subcategory/edit-delete-product-subcategory.component';
import { ProductSubcategoryListComponent } from './product-subcategory/product-subcategory-list/product-subcategory-list.component';
import { EditDeleteSupplierComponent } from './supplier/edit-delete-supplier/edit-delete-supplier.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { SupplierDetailsComponent } from './supplier/supplier-details/supplier-details.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { AddWarehouseComponent } from './warehouse/add-warehouse/add-warehouse.component';
import { EditDeleteWarehouseComponent } from './warehouse/edit-delete-warehouse/edit-delete-warehouse.component';
import { LocationListComponent } from './location/location-list/location-list.component';
import { AddLocationComponent } from './location/add-location/add-location.component';
import { EditDeleteLocationComponent } from './location/edit-delete-location/edit-delete-location.component';
import { AddStandComponent } from './stand/add-stand/add-stand.component';
import { EditDeleteStandComponent } from './stand/edit-delete-stand/edit-delete-stand.component';
import { StandListComponent } from './stand/stand-list/stand-list.component';
import { AddStockComponent } from './stock/add-stock/add-stock.component';
import { EditDeleteStockComponent } from './stock/edit-delete-stock/edit-delete-stock.component';
import { StockListComponent } from './stock/stock-list/stock-list.component';
import { AuthGuard } from '@app/auth.guard';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master Data',
    },
    canActivate: [AuthGuard],
    children: [
     
      {
        path: 'company/add',
        component: AddCompanyComponent,
        data: {
          title: 'Add Company',
        },
      },
      {
        path: 'company/edit/:id',
        component: EditDeleteCompanyComponent,
        data: {
          title: 'Edit Company',
        },
      },
      {
        path: 'company/delete/:id',
        component: EditDeleteCompanyComponent,
        data: {
          title: 'Delete Company',
        },
      },
      //Supplier
      {
        path: 'suppliers',
        component: SupplierListComponent,
        data: {
          title: 'Suppliers',
        },
      },
      {
        path: 'supplier/add',
        component: AddSupplierComponent,
        data: {
          title: 'Add Supplier',
        },
      },
      {
        path: 'supplier/details/:id',
        component: SupplierDetailsComponent,
        data: {
          title: 'Supplier Details',
        },
      },
      {
        path: 'supplier/edit/:id',
        component: EditDeleteSupplierComponent,
        data: {
          title: 'Edit Supplier',
        },
      },
      {
        path: 'supplier/delete/:id',
        component: EditDeleteSupplierComponent,
        data: {
          title: 'Delete Supplier',
        },
      },


      //Customer
      {
        path: 'customers',
        component: CustomerListComponent,
        data: {
          title: 'Customers',
        },
      },
      {
        path: 'customer/add',
        component: AddCustomerComponent,
        data: {
          title: 'Add Customer',
        },
      },
      {
        path: 'customer/details/:id',
        component: CustomerDetailsComponent,
        data: {
          title: 'Customer Details',
        },
      },
      {
        path: 'customer/edit/:id',
        component: EditDeleteCustomerComponent,
        data: {
          title: 'Edit Customer',
        },
      },
      {
        path: 'customer/delete/:id',
        component: EditDeleteCustomerComponent,
        data: {
          title: 'Delete Customer',
        },
      },

      //Warehouse
      {
        path: 'warehouses',
        component: WarehouseListComponent,
        data: {
          title: 'Warehouses',
        },
      },
      {
        path: 'warehouse/add',
        component: AddWarehouseComponent,
        data: {
          title: 'Add Warehouse',
        },
      },
      // {
      //   path: 'warehouse/details/:id',
      //   component: CustomerDetailsComponent,
      //   data: {
      //     title: 'Customer Details',
      //   },
      // },
      {
        path: 'warehouse/edit/:id',
        component: EditDeleteWarehouseComponent,
        data: {
          title: 'Edit Warehouse',
        },
      },
      {
        path: 'warehouse/delete/:id',
        component: EditDeleteWarehouseComponent,
        data: {
          title: 'Delete Warehouse',
        },
      },
      //Stands

      {
        path: 'stands',
        component: StandListComponent,
        data: {
          title: 'Stands',
        },
      },
      {
        path: 'stand/add',
        component: AddStandComponent,
        data: {
          title: 'Add Stand',
        },
      },
      // {
      //   path: 'stand/details/:id',
      //   component: CustomerDetailsComponent,
      //   data: {
      //     title: 'Customer Details',
      //   },
      // },
      {
        path: 'stand/edit/:id',
        component: EditDeleteStandComponent,
        data: {
          title: 'Edit Stand',
        },
      },
      {
        path: 'stand/delete/:id',
        component: EditDeleteStandComponent,
        data: {
          title: 'Delete Stand',
        },
      },
      //Stock

      
{
  path: 'stocks',
  component: StockListComponent,
  data: {
    title: 'Stocks',
  },
},
{
  path: 'stock/add',
  component: AddStockComponent,
  data: {
    title: 'Add Stock',
  },
},
// {
//   path: 'stock/details/:id',
//   component: CustomerDetailsComponent,
//   data: {
//     title: 'Customer Details',
//   },
// },
{
  path: 'stock/edit/:id',
  component: EditDeleteStockComponent,
  data: {
    title: 'Edit Stock',
  },
},
{
  path: 'stock/delete/:id',
  component: EditDeleteStockComponent,
  data: {
    title: 'Delete Stock',
  },
},

      //Location
      {
        path: 'locations',
        component: LocationListComponent,
        data: {
          title: 'Locations',
        },
      },
      {
        path: 'location/add',
        component: AddLocationComponent,
        data: {
          title: 'Add Location',
        },
      },
      // {
      //   path: 'location/details/:id',
      //   component: CustomerDetailsComponent,
      //   data: {
      //     title: 'Customer Details',
      //   },
      // },
      {
        path: 'location/edit/:id',
        component: EditDeleteLocationComponent,
        data: {
          title: 'Edit Location',
        },
      },
      {
        path: 'location/delete/:id',
        component: EditDeleteLocationComponent,
        data: {
          title: 'Delete Location',
        },
      },

      //Product
      {
        path: 'products',
        component: ProductListComponent,
        data: {
          title: 'Products',
        },
      },
      {
        path: 'product/add',
        component: AddProductComponent,
        data: {
          title: 'Add Product',
        },
      },
      {
        path: 'product/edit/:id',
        component: EditDeleteProductComponent,
        data: {
          title: 'Edit Product',
        },
      },
      {
        path: 'product/delete/:id',
        component: EditDeleteProductComponent,
        data: {
          title: 'Delete Product',
        },
      },
      {
        path: 'product-categories',
        component: ProductCategoryListComponent,
        data: {
          title: 'Product Category',
        },
      },
      {
        path: 'product-category/add',
        component: AddProductCategoryComponent,
        data: {
          title: 'Add Product Category',
        },
      },
      {
        path: 'product-category/edit/:id',
        component: EditDeleteProductCategoryComponent,
        data: {
          title: 'Edit Product Category',
        },
      },
      {
        path: 'product-category/delete/:id',
        component: EditDeleteProductCategoryComponent,
        data: {
          title: 'Delete Product Category',
        },
      },
      {
        path: 'product-subcategories',
        component: ProductSubcategoryListComponent,
        data: {
          title: 'Product SubCategory',
        },
      },
      {
        path: 'product-subcategory/add',
        component: AddProductSubcategoryComponent,
        data: {
          title: 'Add Product SubCategory',
        },
      },
      {
        path: 'product-subcategory/edit/:id',
        component: EditDeleteProductSubcategoryComponent,
        data: {
          title: 'Edit Product SubCategory',
        },
      },
      {
        path: 'product-subcategory/delete/:id',
        component: EditDeleteProductSubcategoryComponent,
        data: {
          title: 'Delete Product SubCategory',
        },
      },
      {
        path: 'floating-labels',
        component: FloatingLabelsComponent,
        data: {
          title: 'Floating Labels',
        },
      },
      {
        path: 'layout',
        component: LayoutComponent,
        data: {
          title: 'Layout',
        },
      },
      {
        path: 'validation',
        component: ValidationComponent,
        data: {
          title: 'Validation',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
