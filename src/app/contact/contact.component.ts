import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { DomSanitizer } from '@angular/platform-browser';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {  

  constructor(
    private dialogRef: MatDialogRef<ContactComponent>
    , private dom: DomSanitizer
    , private dialog: MatDialog) { }

  ngOnInit() {
   
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showDialog(content: string) : void {
    let dialogRef = this.dialog.open(DialogComponent, { width : '450px' });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
  }
  
}
