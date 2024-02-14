import { Component } from '@angular/core';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { StandService } from '@app/_shared/services/stand.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';
import { TimeScale } from 'chart.js';

@Component({
  selector: 'app-stand-list',
  templateUrl: './stand-list.component.html',
  styleUrls: ['./stand-list.component.scss']
})
export class StandListComponent {
  warehouses: Warehouse[] = [];
  stands: Stand[] = []
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private warehouseService: WarehouseService, private standService: StandService) {}
  ngOnInit(): void {
    this.getAllWarehouses();
    this.getAllStands();
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

  getAllStands() {
    this.standService.getAllStands().subscribe({
      next: (response: any) => {
        this.stands = response.result;
        console.log(this.stands)
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getWarehouseName(stand: Stand){
    return this.warehouses.find(w => w.id == stand.warehouseId)?.name
  }
}
