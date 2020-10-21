import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
//import * as $ from 'node_modules/jquery';

import { AuthService } from '../app/_services';
import User from './_models/user';
import { Role } from './_models/role';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QualiChain-FE';
  //currentUser: User;
  currentUser: any;

  constructor(
    private router: Router,
    private authservice: AuthService,
    private readonly translate: TranslateService
  ) {

    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  get isLogged() {
    return this.currentUser ;
  }
  
  currentUserHasThisRole(roleName: string) {
    let hasTheRole = false;
    let hasTheRoleByArrayOfRoles = false;
    let hasTheRoleByRole = false;

    if (this.currentUser) {
      
      if (this.currentUser.hasOwnProperty('roles')) {
        if (this.currentUser.roles.indexOf(roleName.toLowerCase())>=0) {
          hasTheRoleByArrayOfRoles = true;
        }
      }      
      
      if (this.currentUser.hasOwnProperty('role')) {
        if (this.currentUser.role.toLowerCase() === roleName.toLowerCase()) {
          hasTheRoleByRole = true;
        }
      }
    }

    hasTheRole = (hasTheRoleByArrayOfRoles || hasTheRoleByRole);

    return hasTheRole;
  }

  get isAdmin() {
    let isAdmin = false;
    let isAdministrator = false;

    isAdmin = this.currentUserHasThisRole(Role.admin.toLowerCase());
    if (!isAdmin) {
      isAdministrator = this.currentUserHasThisRole(Role.administrator.toLowerCase());
    }
    
    let userIsAdmin = (this.currentUser && (isAdmin || isAdministrator));
    //return this.currentUser && (this.currentUser.role.toLowerCase() === Role.admin.toLowerCase() || this.currentUser.role.toLowerCase() === Role.administrator.toLowerCase()) ;
    return userIsAdmin;
  }

  get isRecruiter() {
    let isAdmin = false;
    let isRecruiter = false;

    isAdmin = this.currentUserHasThisRole(Role.admin.toLowerCase());
    if (!isAdmin) {
      isRecruiter = this.currentUserHasThisRole(Role.recruiter.toLowerCase());
    }

    let userIsRecruiter = (this.currentUser && (isAdmin || isRecruiter));
    //return this.currentUser && ((this.currentUser.role.toLowerCase() === Role.recruiter.toLowerCase()) || (this.currentUser.role.toLowerCase() === Role.admin.toLowerCase() || (this.currentUser.role.toLowerCase() === Role.administrator.toLowerCase())));
    return isRecruiter;
  }

  get isProfessor() {
    let isAdmin = false;
    let isProfessor = false;

    isAdmin = this.currentUserHasThisRole(Role.admin.toLowerCase());
    if (!isAdmin) {
      isProfessor = this.currentUserHasThisRole(Role.professor.toLowerCase());
    }

    let userIsProfessor = (this.currentUser && (isAdmin || isProfessor));
    //return this.currentUser && ((this.currentUser.role.toLowerCase() === Role.professor.toLowerCase()) || (this.currentUser.role.toLowerCase() === Role.admin.toLowerCase() || (this.currentUser.role.toLowerCase() === Role.administrator.toLowerCase())));
    return userIsProfessor;
  }

  get isStudent() {
    let isAdmin = false;
    let isStudent = false;

    isAdmin = this.currentUserHasThisRole(Role.admin.toLowerCase());
    if (!isAdmin) {
      isStudent = this.currentUserHasThisRole(Role.student.toLowerCase());
    }

    let userIsStudent = (this.currentUser && (isAdmin || isStudent));    
    //return this.currentUser && ((this.currentUser.role.toLowerCase() === Role.student.toLowerCase()) || (this.currentUser.role.toLowerCase() === Role.admin.toLowerCase() || (this.currentUser.role.toLowerCase() === Role.administrator.toLowerCase())));
    return userIsStudent;
  }
  
  get isEmployee() {
    let isAdmin = false;
    let isEmployee = false;

    isAdmin = this.currentUserHasThisRole(Role.admin.toLowerCase());
    if (!isAdmin) {
      isEmployee = this.currentUserHasThisRole(Role.employee.toLowerCase());
    }
    
    let userIsEmployee = (this.currentUser && (isAdmin || isEmployee));     
    //return this.currentUser && ((this.currentUser.role.toLowerCase() === Role.employee.toLowerCase()) || (this.currentUser.role.toLowerCase() === Role.admin.toLowerCase() || (this.currentUser.role.toLowerCase() === Role.administrator.toLowerCase())));
    return userIsEmployee;
  }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

  /*
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'pt', 'el']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pt|el/) ? browserLang : 'en');
  
  }
  */

 ngOnInit() { // In the ngOnInit() or in the constructor
  
  const el = document.getElementById('nb-global-spinner');
  if (el) {
    setTimeout(()=>{
      el.style['display'] = 'none';
    },1500);
    
  }

  /*
          Responsive nav menu with sub menus on larger screens.
  
          built using very limited amount of js (javascript adds a couple of css classes) and to deal with an unknown number of menu items (used in several WordPress themes).
  
          many further enhancements could easily be made (for example I normally include js to allow keyboard focus to automatically expand the collapsed menus) outside the scope of this demo.
  
          The CSS could do with a bit of a clean up at the moment and the styling has intentionally been left very basic for this demo but the key points should still be clear!
          */
  
          /**********
          MOBILE MENU
          **********/

  $('.menu-toggle').click(function(e){
    //click event for left clicks only! http://www.jacklmoore.com/notes/click-events
    if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey)) {
      e.preventDefault();
      if($(this).parent().find('.menu').hasClass('expanded-mobile-menu')){
        $(this).removeClass('expanded-menu-toggle').parent().removeClass('nav-expanded').find('.menu').removeClass('expanded-mobile-menu');
      }else{
        $(this).addClass('expanded-menu-toggle').parent().addClass('nav-expanded').find('.menu').addClass('expanded-mobile-menu');
      }
    }

		(function($){
			"use strict";
			$.fn.extend({ 
			rotaterator: function(options) { 
				//var defaults = {
				//    fadeSpeed: 1500,
				//    pauseSpeed: 2000,
				//	child:null
				//};             
				//var options = $.extend(defaults, options);         
				return this.each(function() {
					var o =options;
					var obj = $(this);                
					var items = $(obj.children(), obj);
					items.each(function() {$(this).hide();});
					if(!o.child){var next = $(obj).children(':first');
					}else{var next = o.child;
					}
					$(next).fadeIn(o.fadeSpeed, function() {
						$(next).delay(o.pauseSpeed).fadeOut(o.fadeSpeed, function() {
							var next = $(this).next();
							if (next.length === 0){
								next = $(obj).children(':first');
							}
							$(obj).rotaterator({child : next, fadeSpeed : o.fadeSpeed, pauseSpeed : o.pauseSpeed});
						});
					});
				});
			}
			});
    })($);
        
    // banner text rotator
    $(document).ready(function(){
      "use strict";
      $('#rotate').rotaterator({fadeSpeed:1500, pauseSpeed:2000});
    });

  });

  $(document).ready(function(){
    $(".hamburger").click(function(){
      $(this).toggleClass("is-active");
    });
  });

  
 }
 
}
