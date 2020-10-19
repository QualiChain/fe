import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../_services';
import { exit } from 'process';
import permissionsByRole from "../_helpers/permissionsByRole";

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

    for (const elementV of value) {
        if (permissionsByRole[elementV]) {
            for (const pRole of permissionsByRole[elementV]) {
                //check if logged user has this role                
                if (this.currentUser.hasOwnProperty('role')) {
                    if (this.currentUser['role']===pRole) {
                        authorized = true;
                        exit;
                    }
                }                                
                if (this.currentUser.hasOwnProperty('roles')) {
                    if (this.currentUser['roles'].indexOf(pRole) > -1) {
                        authorized = true;
                        exit;
                    }
                }
            }
        }
    }

    if (authorized) {
        this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
        this.viewContainer.clear();
    }
  }

  ngOnDestroy(): void {
    this.permission$.unsubscribe();
  }

}