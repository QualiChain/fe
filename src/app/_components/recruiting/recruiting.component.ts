import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../_services/recruiting/validate.service'
import { QualichainService} from '../../_services/recruiting/qualichain.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import {TranslateService} from '@ngx-translate/core';
import { QCMatomoConnectorService} from '../../_services/qc-matomo-connector.service';

@Component({
  selector: 'app-recruiting',
  templateUrl: './recruiting.component.html',
  styleUrls: ['./recruiting.component.css']
})

export class RecruitingComponent implements OnInit {
  // Successful; Error; Not Successful
  validationStatus: string = '';
  fileToUpload: File = null;
  inputDID: string;
  inputCivilID: string;
  response: any = '';
  //response: any = 'Response from the request goes here';
  responseBox: HTMLElement;
    isMultipleUploaded = false;
    isSingleUploaded = false;
    acceptedExtensions = "jpg, jpeg, bmp, png, wav, mp3, mp4";
    errorBox: any = 'Any errors from the request goes here'
    error: boolean = false;
    uploaded: boolean = false;
  //Validation Retrieved
  status: string = 'Awaiting validation...';
  showMessage: boolean = false;
  errorMessage: string = '';
  loadingSpinner: boolean = false;
  
  constructor(
    private mc: QCMatomoConnectorService,
    private qualichainService: QualichainService,            
              private flashMessage: FlashMessagesService,
              private validateService: ValidateService,
              private translate: TranslateService
              ) { }


  ngOnInit() {

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploaded = true;
  }

  validateCertificate(form: any) {

      let data = {
        certificate: (<HTMLInputElement>document.getElementById('myCertificate')).files[0],
        did:  form.value.inputDID,
        civilId: form.value.inputCivilID
      }

      if (!this.validateService.validateAddress(data.did))  {
          //this.flashMessage.show('Please insert a valid address (see examples)', {cssClass: 'alert-danger', timeout: 3000});
          this.flashMessage.show(this.translate.instant('RECRUITING.WARNING.INVALID_ADDRESS'), {cssClass: 'alert-danger', timeout: 3000});
          return false;
      }

      if (!this.validateService.validateCivilID(data.civilId,))  {
          //this.flashMessage.show('Please insert a valid Civil ID (integer)', {cssClass: 'alert-danger', timeout: 3000});
          this.flashMessage.show(this.translate.instant('RECRUITING.WARNING.INVALID_CIVIL_ID'), {cssClass: 'alert-danger', timeout: 3000});
          return false;
      }

      if (!this.validateService.validateCertificate(this.uploaded,this.fileToUpload))  {
          //this.flashMessage.show('Please insert a valid certificate (.pdf)', {cssClass: 'alert-danger', timeout: 3000});
          this.flashMessage.show(this.translate.instant('RECRUITING.WARNING.INVALID_CERTIFICATE'), {cssClass: 'alert-danger', timeout: 3000});
          return false;
      }
      const formData: FormData = new FormData();
      formData.append('certificate', (<HTMLInputElement>document.getElementById('myCertificate')).files[0]);
      formData.append('did', data.did);
      formData.append('civilId', data.civilId);
      //console.log("DATA:");
      //console.log(data);
      //console.log("FORM DATA:");
      //console.log(formData);
      this.loadingSpinner = true;
      this.qualichainService.validateCertificate(formData).subscribe(data => {
        this.showMessage = true;
        
        //this.status = 'Awaiting validation...';
        this.status = this.translate.instant('RECRUITING.STATUS.WAITING');
        this.errorMessage = '';
        //document.getElementById('responseBoxError').innerHTML = '';
        this.validationStatus = "";
        this.response = "";
        this.error = false;

          //console.log(data);
         if (data.status==200) { 
          //this.status = 'Done';
          this.status = this.translate.instant('RECRUITING.STATUS.DONE');

          if('body' in data){
            
            let eventCategory = "Certificate Validation";
            let eventAction = null;
            let eventName = null;
            let eventValue = null;
          if (data.body.succeeded) {
                eventAction = 'Certificate Validation Success';
                this.mc.sendMatomoEvent(eventCategory, eventAction, eventName, eventValue);
                this.loadingSpinner = false;
                this.error = false;
                //this.validationStatus = 'Success';
                this.validationStatus = this.translate.instant('RECRUITING.STATUS.SUCCESS');
                this.response = data.body.message + this.translate.instant('RECRUITING.CERTIFICATE_HASH') + data.body.response_data;
                //document.getElementById('responseBoxError').innerHTML = '';
                this.errorMessage = '';
        }   else {
                eventAction = 'Certificate Validation Failure';
                this.mc.sendMatomoEvent(eventCategory, eventAction, eventName, eventValue);
                this.loadingSpinner = false;
                this.error = true;
                //this.validationStatus = 'Error';
                this.validationStatus = this.translate.instant('RECRUITING.STATUS.ERROR');
                this.response = data.body.message;
                this.errorBox = data.body.error;
                //document.getElementById('responseBoxError').innerText = data.body.error
                this.errorMessage = data.body.error;
          }
        }
        }

      }, error => {
        //this.status = 'Error';
        this.loadingSpinner = false;
        this.status = this.translate.instant('RECRUITING.STATUS.ERROR');
        //document.getElementById('responseBox').removeClass("alert alert-primary");
        this.response = error;
        console.log(error);
      });
  }

}

