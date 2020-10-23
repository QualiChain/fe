import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services';
import { exit } from 'process';
import permissionsByRole from "../_helpers/permissionsByRole";
import { Injectable } from '@angular/core';


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
    /*
    let permissionsByRole: {} = {
        'view_user_profile': ['student', 'professor'],
        'view_user_profile_2': ['admin', 'recruiter'],
        'view_user_profile_3': ['student', 'professor'],
    };*/
    
    //this.currentUser['roles'] = ['student', 'professor', 'admin', 'employee'];
    //authorized = this.checkIfPermissionsExistsByUserRoles(value);
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
        private authenticationService: AuthService
    ) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser) {
            // check if route is restricted by role           
            if (route.data.permissions) {
                
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