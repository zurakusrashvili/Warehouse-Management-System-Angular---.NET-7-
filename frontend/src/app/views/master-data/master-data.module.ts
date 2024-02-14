import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  PaginationModule,
  ProgressModule,
  SharedModule,
  TableModule,
  ToastModule
} from '@coreui/angular';

import { DocsComponentsModule } from '../../../components/docs-components.module';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { RangesComponent } from './ranges/ranges.component';
import { FloatingLabelsComponent } from './floating-labels/floating-labels.component';
import { SelectComponent } from './select/select.component';
import { InputGroupsComponent } from './input-groups/input-groups.component';
import { LayoutComponent } from './layout/layout.component';
import { ValidationComponent } from './validation/validation.component';
import { IconModule } from '@coreui/icons-angular';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
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
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { SupplierDetailsComponent } from './supplier/supplier-details/supplier-details.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { EditDeleteSupplierComponent } from './supplier/edit-delete-supplier/edit-delete-supplier.component';
import { AddWarehouseComponent } from './warehouse/add-warehouse/add-warehouse.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { EditDeleteWarehouseComponent } from './warehouse/edit-delete-warehouse/edit-delete-warehouse.component';
import { AddLocationComponent } from './location/add-location/add-location.component';
import { EditDeleteLocationComponent } from './location/edit-delete-location/edit-delete-location.component';
import { LocationListComponent } from './location/location-list/location-list.component';
import { AddStockComponent } from './stock/add-stock/add-stock.component';
import { EditDeleteStockComponent } from './stock/edit-delete-stock/edit-delete-stock.component';
import { StockListComponent } from './stock/stock-list/stock-list.component';
import { AddStandComponent } from './stand/add-stand/add-stand.component';
import { EditDeleteStandComponent } from './stand/edit-delete-stand/edit-delete-stand.component';
import { StandListComponent } from './stand/stand-list/stand-list.component';


@NgModule({
  declarations: [
    RangesComponent,
    FloatingLabelsComponent,
    SelectComponent,
    CustomerListComponent,
    InputGroupsComponent,
    LayoutComponent,
    ValidationComponent,
    AddCustomerComponent,
    CustomerDetailsComponent,
    CustomerListComponent,
    EditDeleteCustomerComponent,
    ProductCategoryListComponent,
    AddProductCategoryComponent,
    EditDeleteProductCategoryComponent,
    AddCompanyComponent,
    ProductListComponent,
    AddProductComponent,
    EditDeleteProductComponent,
    AddProductSubcategoryComponent,
    EditDeleteProductSubcategoryComponent,
    ProductSubcategoryListComponent,
    AddSupplierComponent,
    SupplierDetailsComponent,
    SupplierListComponent,
    EditDeleteSupplierComponent,
    AddWarehouseComponent,
    WarehouseListComponent,
    EditDeleteWarehouseComponent,
    AddLocationComponent,
    EditDeleteLocationComponent,
    LocationListComponent,
    AddStockComponent,
    EditDeleteStockComponent,
    StockListComponent,
    AddStandComponent,
    EditDeleteStandComponent,
    StandListComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    DocsComponentsModule,
    CardModule,
    IconModule,
    FormModule,
    GridModule,
    ProgressModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    AvatarModule,
    TableModule,
    ListGroupModule,
    ToastModule,
    PaginationModule
  ]
})
export class MasterDataModule {
}
