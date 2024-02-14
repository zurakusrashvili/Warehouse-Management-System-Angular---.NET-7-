// import { Component, OnInit } from '@angular/core';
// import { Company } from '@models/master-data/company.model';

// import { CompanyService } from 'src/app/_shared/services/company.service';
// @Component({
//   selector: 'app-company-list',
//   templateUrl: './company-list.component.html',
//   styleUrls: ['./company-list.component.scss']
// })
// export class CompanyListComponent implements OnInit {
//   companies: Company[] = [];
//   pageSize: number = 5;
//   pageNumber: number = 1;
//   constructor(private companyService: CompanyService) {}
//   ngOnInit(): void {
//     this.getAllcompany();
//   }

//   getAllcompany() {
//     this.companyService.getAllCompanies().subscribe({
//       next: (response: any) => {
//         this.companies = response.result;
//       },
//       error: (err: any) => {
//         console.log(err);
//       },
//     });
//   }
// }
