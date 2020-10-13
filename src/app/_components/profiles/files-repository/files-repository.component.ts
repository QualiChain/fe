import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { UsersService } from '../../../_services/users.service';
import { UploadService } from '../../../_services/upload.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../utils/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
//import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QCStorageService } from '../../../_services/QC_storage.services';

let ELEMENT_DATA = [];
const downloadUrl = environment.downloadFilesUrl;

@Component({
  selector: 'app-files-repository',
  templateUrl: './files-repository.component.html',
  styleUrls: ['./files-repository.component.css']
})
export class FilesRepositoryComponent implements OnInit {

  profileId: Number = null;
  

  constructor(
    private qcStorageService: QCStorageService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private us: UploadService,
    private router: Router,
    private route: ActivatedRoute
    ) { }
  
  filesList: any[] = [];

  displayedColumns: string[] = ['name', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.route.params.subscribe(params => {
      const id = +params.id;
      //console.log(id);
      if (id && id > 0) {
        //let userdata = JSON.parse(localStorage.getItem('userdata'));
        let userdata = JSON.parse(this.qcStorageService.QCDecryptData(localStorage.getItem('userdataQC')));

        if ((String(userdata.id) == String(id)) || (userdata.role.toLowerCase() =='administrator')) {
          this.profileId = id;

          this.loadUserFiles();

        }
        else {
          this.router.navigate(["/access_denied"]);
        }
      }
      else {
        this.router.navigate(["/access_denied"]);
      }

    });
  }


  confirmDialog(fileId, title): void {
    //const message = `Are you sure you want to do this?`;
    const message = this.translate.instant('PERSONAL_FILES_REPOSITORY.DELETE_MESSAGE') + " ("+title+")";
    
    const dialogData = new ConfirmDialogModel(this.translate.instant('PERSONAL_FILES_REPOSITORY.CONFIRM_ACTION'), message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;

      if (dialogResult) {
         //console.log("Under construction");
         this.deleteFile(fileId)
      }
    });
  }

  deleteFile(fileId: number) { 

    this.us.deleteFile(+this.profileId, fileId).subscribe(
      res => {
        //console.log("the file has been deleted");
        this.loadUserFiles();
      },
      error => {
        console.log("Error deleting file data");
        console.log(error);
        
      }
    );

  }


  downLoadFile(fileId: number, fileName: string, action:string) {
    if (action=='open') {
        window.open(downloadUrl+'/file/'+fileId);
    }
    else {
    
        this.us.getFile(fileId).subscribe(
          (response: any) =>{
            //console.log(response);
            if (action =='download') {
              let dataType = response.type;
              let binaryData = [];
              binaryData.push(response);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
              if (fileName)
                  downloadLink.setAttribute('download', fileName);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
            else if (action=='print') {
              //var blob = new Blob([response.blob()], {type: dataType});
              const blobUrl = URL.createObjectURL(response);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();
            }

          }
        )
  }


  }

  loadUserFiles() {    

    this.us.getUserFiles(this.profileId).subscribe(
      res => {
        //console.log("Request OK");
        //console.log(res);
        this.filesList = res.files;
        let data = [];
        res.files.forEach(element => {
          data.push({name: element});
        });

        this.dataSource.data = data;
      },
      error => {
        console.log("Error getting data");
        this.router.navigate(["/not_found"]);
        
      }
    );
  }

  myCallbackFunction = (args: any): void => {
    //callback code here
    //console.log("hi!!!");
    
    setTimeout( () => { this.loadUserFiles(); }, 1000 );
  }

}
