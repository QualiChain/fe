import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService } from '../../../_services/upload.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

  constructor(public uploads: UploadService) { }

  @Input() validFiles: string[] = [];
  @Input() maxNumberOfFiles: number = null;
  @Input() userId: number = null;
  @Input() fileDestination: string = null;
  @Input() callbackFunction: (args: any) => void;
  @Input() currentAvatarFileId: number = null;

  imgURL = [];
  ngOnInit() {
  }

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    //console.log(files);
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress>0 && this.files[index].progress < 100 && this.files[index].error==false) {
      console.log("Upload in progress.");
      return;
    }
    

    if (this.files[index].uploaded) {
      console.log("Pending delete it from the cloud");
      this.files.splice(index, 1);
      this.imgURL.splice(index, 1);
    }
    else {
      this.files.splice(index, 1);
      this.imgURL.splice(index, 1);
    }

    
  }



  uploadFilesToServer() {    
    //console.log(this.fileDestination);
    let filtered = this.files.filter(f => f.progress<100);
    let filtered2 = filtered.filter(f => f.validfile==true);
    //let progressItem = this.us.upload(this.files);
    //let progressItem = this.us.upload(filtered2);
    if (this.fileDestination=='avatarImage') {
      let progressItem = this.uploads.uploadUserAvatar(this.userId, filtered2, this.callbackFunction);
    }
    else if (this.fileDestination=='personalFileRepository') {
      let progressItem = this.uploads.upload(this.userId, filtered2, this.callbackFunction);
    }
    else if (this.fileDestination=='KGFile') {
      let progressItem = this.uploads.uploadCVKG(this.userId, filtered2, this.callbackFunction);
    }

  }
  
  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {   
    /*
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
    */
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  tooMuchFiles = false;
  prepareFilesList(files: Array<any>) {
    this.tooMuchFiles = false;
    let acceptFile: boolean = false;
    if (this.maxNumberOfFiles==null) {
      acceptFile = true;
    }
    else if (this.maxNumberOfFiles>=files.length) {
      acceptFile = true;
    }
    else {
      acceptFile = false;
      this.tooMuchFiles = true;
    }

    if (acceptFile) {
      let cntFiles = 0;
      for (const item of files) {
        //console.log(item);
        //console.log(this.validFiles);
        if (this.validFiles.length==0) {
          item.validfile = true;
        }
        else {
          let existInArray = this.validFiles.indexOf(item.type);
          if (existInArray>=0) {
            item.validfile = true;
          }
          else {
            item.validfile = false;
          }
          //console.log(existInArray);
        }
        
        if (item.type.match(/image\/*/) == null) {
          this.imgURL.push("");
        }
        else {
          var reader = new FileReader();          
          reader.readAsDataURL(item); 
          reader.onload = (_event) => { 
            this.imgURL.push(reader.result); 
          }
        }
        
        /*
        if (item.type=="image/png") {
          item.validfile = true;
        }
        else {
          item.validfile = false;
        }
        */
        item.progress = 0;
        item.error = false;
        item.uploaded = false;
        
  
        this.files.push(item);
        cntFiles = cntFiles +1;
      }
      this.fileDropEl.nativeElement.value = "";
      this.uploadFilesSimulator(0);
    }
    else {
      console.log("You raised the maximum number of files ("+this.maxNumberOfFiles+")");
    }
    
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

}
