import { Component } from '@angular/core';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { Location } from '@app/_shared/models/master-data/location.model';
import { StandService } from '@app/_shared/services/stand.service';
import { LocationService } from '@app/_shared/services/location.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent {
  locations: Location[] = [];
  stands: Stand[] = []
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private locationService: LocationService, private standService: StandService) {}
  ngOnInit(): void {
    this.getAllLocations();
    this.getAllStands();
  }

  getAllStands() {
    this.standService.getAllStands().subscribe({
      next: (response: any) => {
        this.stands = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (response: any) => {
        let locations: Location[] = response.result;
        this.locations = locations.filter(l => l.id !== 1);
        console.log(this.stands)
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getStandName(location: Location){
    return this.stands.find(w => w.id == location.standId)?.standName
  }
}
