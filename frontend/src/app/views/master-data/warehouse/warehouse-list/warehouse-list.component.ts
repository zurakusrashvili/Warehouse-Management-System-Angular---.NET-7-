import { Component } from '@angular/core';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { WarehouseService } from '@app/_shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent {
  warehouses: Warehouse[] = [];

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.getAllWarehouses();
  }

  getAllWarehouses() {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (response: any) => {
        this.warehouses = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
