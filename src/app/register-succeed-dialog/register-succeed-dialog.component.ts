import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-succeed-dialog',
  templateUrl: './register-succeed-dialog.component.html',
  styleUrls: ['./register-succeed-dialog.component.scss']
})
export class RegisterSucceedDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RegisterSucceedDialogComponent>,
    private router: Router) { 

  }

  login() {
    this.dialogRef.close('signin');
  }

}
