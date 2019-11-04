import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormBuilder,
} from '@angular/forms';
import { DbService } from 'src/app/shared/db/db.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  fileUploadForm: FormGroup
  fusionFile: any
  dcsFile: any
  uploadProgress: string

  constructor(private dbService: DbService, fb: FormBuilder) {
    this.fileUploadForm = fb.group({
      FusionRequests: [],
      DCSrequests: []
    });
  }

  ngOnInit() {
  }


  setFiles(event) {
    if (event.target.id == "FusionRequests")
      this.fusionFile = event.target.files[0]
    else
      this.dcsFile = event.target.files[0]
  }

  submitFiles() {
    let that = this
    this.dbService.postUploadFiles(this.fusionFile, this.dcsFile).subscribe({
      error(err) {that.uploadProgress = "There was an error importing the data" },
      complete() {
        that.dbService.getUploadStatus().subscribe(
          data => {that.uploadProgress = data['status']}  )
      },
    })
  }
  showHourGlassIcon(){
    return (this.uploadProgress != null && this.uploadProgress != "Finished importing data.")
  }
}
