import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './_shared/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check if the user is authenticated using your AuthService logic
    if (this.authService.isLoggedIn) {
      return true; // User is authenticated, allow access to the route
    } else {
      // User is not authenticated, redirect to login and store the redirect URL
      // this.authService.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}