import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@app/_shared/services/auth.service';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService, private authService: AuthService, private router: Router) {
    super();
  }

  logOutHandler(){
    this.authService.logout().subscribe({
      next: (response) => {
        console.log("Logged out successfully");
    
        // Update isLoggedIn state in authService
        this.authService.isLoggedIn = false;
    
        // Redirect to the login page
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error("Error during logout:", err);
        // Handle the error if needed
      },
    });
  }
}
  
  

