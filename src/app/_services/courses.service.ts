import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Course from '../_models/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  
  private coursesURL = environment.coursesUrl;
  private usersURL = environment.usersUrl;

  constructor(private http: HttpClient) { }

    addCourse(dataIn: any) {
        return this.http.post(`${this.coursesURL}`, dataIn).
        pipe(
            map((data: any) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
    }  

    getCourses_old() {
        return this
           .http
           .get(`${this.coursesURL}`);
    }

    getCourses() {
        return this.http.get(`${this.coursesURL}`).
        pipe(
            map((data: Course[]) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
        }


    getCourse(courseId: Number) {
        return this.http.get(`${this.coursesURL}/${courseId}`).
        pipe(
            map((data: Course) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
        }


    updateCourse(courseId: number, dataIn: any) {
        return this.http.put(`${this.coursesURL}/${courseId}`, dataIn).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
    }

    deleteCourse(courseId: Number) {
        return this.http.delete(`${this.coursesURL}/${courseId}`).
        pipe(
            map((data: Course) => {
                return data;
            }), catchError( error => {
                return throwError( 'Something went wrong!' );
            })
        )
        }
       

        getCompletedCourseByUserId(userId: Number) {
            return this.http.get(`${this.coursesURL}/completedcourses/${userId}`).
            pipe(
                map((data: Course[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }
        

        getTeachingCourseByUserId(userId: Number) {
            return this.http.get(`${this.coursesURL}/teachingcourses/${userId}`).
            pipe(
                map((data: Course[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

        getSkillsByCourseId(courseId: Number) {
            return this.http.get(`${this.coursesURL}/${courseId}/skills`).
            pipe(
                map((data: any[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

    
        
        enrollUser(userId: Number, dataIn: any) {
            return this.http.post(`${this.usersURL}/${userId}/courses`, dataIn).
            pipe(
                map((data: any) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        } 


        getEnrolledUserByCourseId(courseId: Number) {
            return this.http.get(`${this.coursesURL}/${courseId}/users`).
            pipe(
                map((data: any[]) => {
                    return data;
                }), catchError( error => {
                    return throwError( 'Something went wrong!' );
                })
            )
        }

}
