import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Course from '../_models/course';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  
  private coursesURL = environment.coursesUrl;
  private usersURL = environment.usersUrl;

  constructor(
    private authService: AuthService,  
    private http: HttpClient) { }

    addCourse(dataIn: any) {
        let headers = this.authService.createQCAuthorizationHeader();

        return this.http.post(`${this.coursesURL}`, dataIn, {headers:headers}).
        pipe(
            map((data: any) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
    }  


    getCourses() {
        let headers = this.authService.createQCAuthorizationHeader();

        return this.http.get(`${this.coursesURL}`, {headers:headers}).
        pipe(
            map((data: Course[]) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
        }


    getCourse(courseId: Number) {
        let headers = this.authService.createQCAuthorizationHeader();

        return this.http.get(`${this.coursesURL}/${courseId}`, {headers:headers}).
        pipe(
            map((data: Course) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
        }


    updateCourse(courseId: number, dataIn: any) {
        let headers = this.authService.createQCAuthorizationHeader();

        return this.http.put(`${this.coursesURL}/${courseId}`, dataIn, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
    }

    deleteCourse(courseId: Number) {
        let headers = this.authService.createQCAuthorizationHeader();

        return this.http.delete(`${this.coursesURL}/${courseId}`, {headers:headers}).
        pipe(
            map((data: Course) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
        }
       

        getCompletedCourseByUserId(userId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.coursesURL}/completedcourses/${userId}`, {headers:headers}).
            pipe(
                map((data: Course[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }
        

        getTeachingCourseByUserId(userId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.coursesURL}/teachingcourses/${userId}`, {headers:headers}).
            pipe(
                map((data: Course[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        getSkillsByCourseId(courseId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.coursesURL}/${courseId}/skills`, {headers:headers}).
            pipe(
                map((data: any[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

    
        
        enrollUser(userId: Number, dataIn: any) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.post(`${this.usersURL}/${userId}/courses`, dataIn, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    //return throwError( 'Something went wrong!' );
                    return throwError( error.message );
                })
            )
        } 

        deleteEnrollUser(userId: Number, courseId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.delete(`${this.usersURL}/${userId}/courses/${courseId}`, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        } 

        getEnrolledUserByCourseId(courseId: Number) {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.coursesURL}/${courseId}/users`, {headers:headers}).
            pipe(
                map((data: any[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        getUserEnrollmentStatusByCourseId(courseId: Number, userId: Number, enrollment: string)  {
            let headers = this.authService.createQCAuthorizationHeader();

            return this.http.get(`${this.coursesURL}/${courseId}/users/${userId}/status/${enrollment}`, {headers:headers}).
            pipe(
                map((data: any) => {
                    return data.exists;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }        
}
