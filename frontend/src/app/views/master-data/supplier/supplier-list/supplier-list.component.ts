import { Component } from '@angular/core';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { SupplierService } from '@app/_shared/services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent {
  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.getAllSuppliers();
  }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (response: any) => {
        this.suppliers = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
