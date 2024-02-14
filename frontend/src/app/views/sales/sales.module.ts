import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { AddSalesOrderComponent } from './add-sales-order/add-sales-order.component';
import { EditDeleteSalesOrderComponent } from './edit-delete-sales-order/edit-delete-sales-order.component';
import { AvatarModule, ButtonGroupModule, ButtonModule, CardModule, DropdownModule, FormModule, GridModule, ListGroupModule, PaginationModule, ProgressModule, SharedModule, SpinnerModule, TableModule, ToastModule } from '@coreui/angular';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';


@NgModule({
  declarations: [
    SalesOrderListComponent,
    AddSalesOrderComponent,
    EditDeleteSalesOrderComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
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
    PaginationModule,
    SpinnerModule
  ]
})
export class SalesModule { }
