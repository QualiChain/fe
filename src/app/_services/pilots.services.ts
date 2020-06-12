import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, BehaviorSubject, throwError, fromEventPattern } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Role } from './../_models/role';

@Injectable({
  providedIn: 'root'
})



export class PilotsService {
 
  uri = environment.authUrl;

  getPilots() {
    return PILOTS_DATA;
  }

  getPilot(id: number) {
    
    let dataToReturn: HEADER_MENU;
    
    PILOTS_DATA.forEach(element => {
        if (element.id==id) {
            dataToReturn = element;
        }
    });
    
    return dataToReturn;
  }

}




export interface OPTION_HEADER_MENU {
    id: number;
    order: number;
    label: string;
    route: string;
    public: boolean;
    rolesPermissions: any [];
}

export interface HEADER_MENU {
    id: number;    
    label: string;
    menu: OPTION_HEADER_MENU[];
}



const PILOTS_DATA: HEADER_MENU[] =[]

PILOTS_DATA.push({'id':1, 'label':'ASSET', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.teacher, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.teacher, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});

PILOTS_DATA.push({'id':2, 'label':'NTUA', 'menu':[
      {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.teacher, Role.admin, Role.administrator]},
      {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
      {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.teacher, Role.recruiter, Role.admin, Role.administrator]},
      {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
  ]});

PILOTS_DATA.push({'id':3, 'label':'KBZ1', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.teacher, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.teacher, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});

PILOTS_DATA.push({'id':4, 'label':'KBZ2', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.teacher, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.teacher, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});

PILOTS_DATA.push({'id':5, 'label':'KBZ3', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.teacher, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.teacher, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});
