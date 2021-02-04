import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services';
//import { exit } from 'process';
import { Injectable } from '@angular/core';
import { StorageService } from '../_helpers/global';
import { QCStorageService } from '../_services/QC_storage.services';

@Directive({
  selector: '[appCanAccess]'
})
export class CanAccessDirective implements OnInit, OnDestroy {

    @Input() set appCanAccess(value: string | string[]) {
    this.applyPermission(value);
  }
  private permission$: Subscription;
  currentUser: any;

  constructor(
    private router: Router,  
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authservice: AuthService,
    ) {
  }

  ngOnInit(): void {
  }

  // how to use it
  // into the templates you can add this:
  // <div *appCanAccess="['view_user_profile']"> CODE  </div>
  // if current user has permisions to this string (you can send an array of strings), the contet is displayed
  
  private applyPermission(value: string | string[] ): void {
    this.authservice.currentUser.subscribe(x => this.currentUser = x);

    let authorized: boolean = false;
    
    //console.log(this.currentUser);    
    authorized = this.authservice.checkIfPermissionsExistsByUserRoles(value);

    if (authorized) {
        this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
        this.viewContainer.clear();
    }
  }

  ngOnDestroy(): void {
      if (this.permission$) {
        this.permission$.unsubscribe();
      }
    
  }

}



@Injectable({ providedIn: 'root' })
export class AuthGuardByPermission implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        public storageService: StorageService,
        private qcStorageService: QCStorageService,
    ) { }
    
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser) {
            let dataValidToken = await this.authenticationService.validateTokenIAMAsync();  
            
            if (!dataValidToken) {
                let currentUserData = {'authenticated': false};
                let encryptedDataCurrentUserData = this.qcStorageService.QCEncryptData(JSON.stringify(currentUserData));
                this.storageService.setItem('userdataQC', encryptedDataCurrentUserData);
                this.storageService.setItem('currentUserQC', encryptedDataCurrentUserData);

                this.authenticationService.logout();
                
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }

            // check if route is restricted by role           
            else if (route.data.permissions) {
                
                //let authorized = this.checkIfPermissionsExistsByUserRoles(route.data.permissions);
                let authorized = this.authenticationService.checkIfPermissionsExistsByUserRoles(route.data.permissions);

                if (authorized) {
                    return authorized
                }
                else {
                    // role not authorised so redirect to home page
                    this.router.navigate(['/access_denied']);
                    return false;
                }
            }
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}


@Injectable({ providedIn: 'root' })
export class AuthGuardForAnonymous implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser) {
            this.router.navigate(['/myprofile'], { queryParams: { } });
            return false;
        }
        else {
            return true;    
        }

    }
}