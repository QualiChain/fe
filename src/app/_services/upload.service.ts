import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

//const url = 'http://localhost:3000/upload';
const url = environment.uploadFilesUrl;
//const urlUploadUserAvatar = environment.uploadUserAvatar;
const urlUploadUserAvatar = environment.uploadFilesUrl;

const downloadUrl = environment.downloadFilesUrl;
const deleteFilesUrl = environment.deleteFilesUrl;
const urlUploadCVToKG = environment.uploadCVToKG;
const credentialsKG = "dXNlcjo1VXhMdHdhZUo4Zks=";

@Injectable()
export class UploadService {
  constructor(
    private authService: AuthService,
    private http: HttpClient) { }


    getFileURL(url: string) {
      //const headers = new HttpHeaders();
      //let headers = this.authService.createQCAuthorizationHeader();
      let headers = this.authService.createQCAuthorizationHeaderText();
  
      return this.http.get(`${url}`, {
        headers: headers, 
        responseType: 'blob' as 'json'}).
      pipe(
         map((data: any) => {
           return data;
         }), catchError( error => {
           return throwError( 'Something went wrong!' );
         })
      )
    } 

  getFile(fileId: number) {
    //const headers = new HttpHeaders();
    //let headers = this.authService.createQCAuthorizationHeader();
    let headers = this.authService.createQCAuthorizationHeaderText();

    return this.http.get(`${downloadUrl}/file/${fileId}`, {
      headers: headers, 
      responseType: 'blob' as 'json'}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 
  
  deleteFile(userId: number, fileId: number) {
    //const headers = new HttpHeaders();
    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.delete(`${deleteFilesUrl}/user/${userId}/files/id/${fileId}`, {
      headers: headers, 
      responseType: 'blob' as 'json'}).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  }

  getUserFiles(userId: Number) {

    let headers = this.authService.createQCAuthorizationHeader();

    return this.http.get(`${url}/${userId}/files`, { headers: headers }).
    pipe(
       map((data: any) => {
         return data;
       }), catchError( error => {
         return throwError( 'Something went wrong!' );
       })
    )
  } 

  //to upload file to the KG
  public uploadCVKG(userId: Number,
    //files: Set<File>
    files: any,
    callbackFunction: any
  ): { [key: string]: { progress: Observable<number>, error: Observable<boolean>, uploaded: Observable<boolean> } } {
    // this will be the our resulting map
    const status: { [key: string]: { 
      progress: Observable<number>, 
      error: Observable<boolean>, 
      uploaded: Observable<boolean> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      

      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      //formData.append('image', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      /*
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'image/jpeg'
        })
      };
      */
     const httpOptions = {
      headers: new HttpHeaders({        
      })
      };
      //const headers = new HttpHeaders();
      
      const headers= new HttpHeaders()      
      .set('Authorization', 'Basic '+credentialsKG)      
      ;

      //const req = new HttpRequest('POST', urlUploadCVToKG+'/user/'+userId, formData, {
        const req = new HttpRequest('POST', urlUploadCVToKG+'/fileUpload/cv', formData, {
          headers: headers,
          responseType: 'text',
          reportProgress: true
      }) ;

      // create a new progress-subject for every file
      const progress = new Subject<number>();
      let errorStatus = new  Subject<boolean>();
      let uploadedStatus = new  Subject<boolean>();
      //let error = new Boolean;

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();

      this.http.request(req)
      .subscribe(    
        (event) => {          
        //console.log(event);
        if (event.type === HttpEventType.Response) {
          const responseData = event.body;
          //console.dir(responseData); // do something with the response
          callbackFunction({status:'ok', message:responseData});
        }
        else if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          //console.log("percentDone:"+percentDone);

          if (percentDone>=100) {
            file.uploaded = true;
            uploadedStatus.next(true);            
          }
          else {
            file.uploaded = true;
            uploadedStatus.next(false);
          }
          file.progress=percentDone;          
          file.error=false;
          // pass the percentage into the progress-stream
          errorStatus.next(false);                    
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          uploadedStatus.next(true);
          errorStatus.next(false);
          progress.complete();
        }
      },
      error => {
        console.log("Error uploading CV file data to KG");
        console.log(error);   

        uploadedStatus.next(false);
        errorStatus.next(true);
        file.error=true;
        //console.log(errorStatus);
        status[file.name] = {
          progress: progress.asObservable(),
          error: errorStatus.asObservable(),
          uploaded: uploadedStatus.asObservable()
        };
        file.errorMessage = error.error.message;
        callbackFunction({status:'error', message:error.message});
      }
      );

/*
      this.http.request(req)
      .subscribe(
        event => {
        console.log(event);
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          console.log("percentDone:"+percentDone);

          if (percentDone>=100) {
            file.uploaded = true;
            uploadedStatus.next(true);
          }
          else {
            file.uploaded = true;
            uploadedStatus.next(false);
          }
          file.progress=percentDone;          
          file.error=false;
          // pass the percentage into the progress-stream
          errorStatus.next(false);                    
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          uploadedStatus.next(true);
          errorStatus.next(false);
          progress.complete();
        }
      },
      error => {
        console.log("Error uploading CV file data to KG");
        console.log(error);        
        uploadedStatus.next(false);
        errorStatus.next(true);
        file.error=true;
        //console.log(errorStatus);
        status[file.name] = {
          progress: progress.asObservable(),
          error: errorStatus.asObservable(),
          uploaded: uploadedStatus.asObservable()
        };
        file.errorMessage = error.error.message;

      }
      );
*/      
      //console.log(errorStatus);
      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable(),
        error: errorStatus.asObservable(),
        uploaded: uploadedStatus.asObservable(),
      };
    });

    // return the map of progress.observables
    return status;
  }

  //to upload avatar
  public uploadUserAvatar(userId: Number,
    //files: Set<File>
    files: any,
    callbackFunction: any
  ): { [key: string]: { progress: Observable<number>, error: Observable<boolean>, uploaded: Observable<boolean> } } {
    // this will be the our resulting map
    const status: { [key: string]: { 
      progress: Observable<number>, 
      error: Observable<boolean>, 
      uploaded: Observable<boolean> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      

      const formData: FormData = new FormData();
      
      //formData.append('image', file, file.name);
      //var splitted = file.name.split("."); 
      //formData.append('image', file, file.name);
      formData.append('file', file, "avatar_"+file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress

      /*
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'image/jpeg'
        })
      };
      */
      const httpOptions = {headers: new HttpHeaders({})};

      let headers = this.authService.createQCAuthorizationHeaderForFormData();

      //const req = new HttpRequest('POST', urlUploadUserAvatar+'/user/'+userId+'/avatar', formData, {
      const req = new HttpRequest('POST', urlUploadUserAvatar+"/"+userId+"/file-upload", formData, {
        headers: headers,
        reportProgress: true,
       // responseType: 'text'
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();
      let errorStatus = new  Subject<boolean>();
      let uploadedStatus = new  Subject<boolean>();
      //let error = new Boolean;

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        //console.log(event.type);
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          //console.log("percentDone:"+percentDone);

          if (percentDone>=100) {
            file.uploaded = true;
            uploadedStatus.next(true);
            callbackFunction();
          }
          else {
            file.uploaded = true;
            uploadedStatus.next(false);
          }
          file.progress=percentDone;          
          file.error=false;
          // pass the percentage into the progress-stream
          errorStatus.next(false);                    
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          uploadedStatus.next(true);
          errorStatus.next(false);
          progress.complete();
        }
      },
      error => {
        console.log("Error uploading file data");
        console.log(error);
        uploadedStatus.next(false);
        errorStatus.next(true);
        file.error=true;
        //console.log(errorStatus);
        status[file.name] = {
          progress: progress.asObservable(),
          error: errorStatus.asObservable(),
          uploaded: uploadedStatus.asObservable()
        };
        file.errorMessage = error.error.message;

      }
      );
      //console.log(errorStatus);
      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable(),
        error: errorStatus.asObservable(),
        uploaded: uploadedStatus.asObservable(),
      };
    });

    // return the map of progress.observables
    return status;
  }
 
  //to upload files into the personal file repository
  public upload(userId: Number,
    //files: Set<File>
    files: any,
    callbackFunction: any
  ): { [key: string]: { progress: Observable<number>, error: Observable<boolean>, uploaded: Observable<boolean> } } {
    // this will be the our resulting map
    const status: { [key: string]: { 
      progress: Observable<number>, 
      error: Observable<boolean>, 
      uploaded: Observable<boolean> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      let headers = this.authService.createQCAuthorizationHeaderForFormData();

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url+"/"+userId+"/file-upload", formData, {
        headers: headers,
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();
      let errorStatus = new  Subject<boolean>();
      let uploadedStatus = new  Subject<boolean>();
      //let error = new Boolean;

      // send the http-request and subscribe for progress-updates

      const startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        //console.log(event.type);
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          //console.log("percentDone:"+percentDone);

          if (percentDone>=100) {
            file.uploaded = true;
            uploadedStatus.next(true);
            callbackFunction();
          }
          else {
            file.uploaded = true;
            uploadedStatus.next(false);
          }
          file.progress=percentDone;          
          file.error=false;
          // pass the percentage into the progress-stream
          errorStatus.next(false);                    
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          uploadedStatus.next(true);
          errorStatus.next(false);
          progress.complete();
        }
      },
      error => {        
        console.log("Error uploading file data");
        console.log(error.error.message);
        uploadedStatus.next(false);
        errorStatus.next(true);
        file.error=true;
        //console.log(errorStatus);
        status[file.name] = {
          progress: progress.asObservable(),
          error: errorStatus.asObservable(),          
          uploaded: uploadedStatus.asObservable()
        };
        file.errorMessage = error.error.message;        
      }
      );
      //console.log(errorStatus);
      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable(),
        error: errorStatus.asObservable(),
        uploaded: uploadedStatus.asObservable(),
      };
    });

    // return the map of progress.observables
    return status;
  }
}