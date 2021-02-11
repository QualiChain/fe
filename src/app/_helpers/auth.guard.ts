import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { QCStorageService } from '../_services/QC_storage.services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private qcStorageService: QCStorageService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //const currentUser = this.authenticationService.currentUserValue;
        let currentUser = this.authenticationService.currentUserValue;

        if (!currentUser) {
            currentUser = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));
          }

        if (currentUser) {
            // check if route is restricted by role           
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/access_denied']);
                return false;
            }
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}