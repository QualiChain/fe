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
    image: string;
    public: boolean;
    rolesPermissions: any [];
    permissions: any [];
    submenu?: any[];
}

export interface HEADER_MENU {
    id: number;    
    label: string;
    menu: OPTION_HEADER_MENU[];
}



const PILOTS_DATA: HEADER_MENU[] =[]

PILOTS_DATA.push({'id':0, 'label':'ANONYMOUS', 'menu':[]});

PILOTS_DATA.push({'id':1, 'label':'AUTHENTICATED', 'menu':[
  {'id': 1, 'order': 2, 'image': '/assets/img/courses.jpg', 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator], 'submenu': [], 'permissions': ['view_courses']},
  {'id': 2, 'order': 3, 'image': '/assets/img/jobs.jpg', 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator], 'submenu': [], 'permissions': ['view_jobs']},  
  {'id': 3, 'order': 4, 'image': '/assets/img/profiles.png', 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.professor, Role.recruiter, Role.admin, Role.administrator], 'submenu': [], 'permissions': ['view_profiles']},
  {'id': 4, 'order': 5,  'image': '/assets/img/recruitment.jpg', 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator], 'submenu': [
    {'id': 5, 'order': 1,  'image': '/assets/img/recruitment2.png', 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator], 'permissions': ['view_recruitment'], 'submenu': []},
    {'id': 6, 'order': 2,  'image': '/assets/img/certificate.png', 'label': 'MENU.CERTIFICATE_VALIDATION', 'route': '/recruitment/certificate-validation', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator], 'permissions': ['view_recruitment'], 'submenu': []}
  ], 'permissions': ['view_recruitment']},
  {'id': 7, 'order': 8,  'image': '/assets/img/mcdss.jpg', 'label': 'MENU.MCDSS', 'route': '/MCDSS', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator], 'submenu': [], 'permissions': ['access_MCDSS']},
  {'id': 8, 'order': 8,  'image': '/assets/img/skills.jpg', 'label': 'MENU.SKILLS', 'route': '/skills', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator], 'submenu': [], 'permissions': ['view_skills']},
]});

/*
PILOTS_DATA.push({'id':1, 'label':'OU', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.professor, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});

PILOTS_DATA.push({'id':2, 'label':'NTUA', 'menu':[
      {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator]},
      {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
      {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.professor, Role.recruiter, Role.admin, Role.administrator]},
      {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
  ]});

PILOTS_DATA.push({'id':3, 'label':'ASEP', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.professor, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});

PILOTS_DATA.push({'id':4, 'label':'INESC-ID', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.professor, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});

PILOTS_DATA.push({'id':5, 'label':'KBZ', 'menu':[
    {'id': 1, 'order': 2, 'label': 'MENU.COURSES', 'route': '/courses', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.professor, Role.admin, Role.administrator]},
    {'id': 2, 'order': 3, 'label': 'MENU.JOBS', 'route': '/jobs', 'public': false, 'rolesPermissions':[Role.student, Role.employee, Role.recruiter, Role.admin, Role.administrator]},  
    {'id': 3, 'order': 4, 'label': 'MENU.PROFILES', 'route': '/profiles', 'public': false, 'rolesPermissions':[Role.professor, Role.recruiter, Role.admin, Role.administrator]},
    {'id': 4, 'order': 5, 'label': 'MENU.RECRUITMENT', 'route': '/recruitment', 'public': false, 'rolesPermissions':[Role.recruiter, Role.admin, Role.administrator]}
]});
*/