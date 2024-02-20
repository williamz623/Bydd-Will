import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '../Models/User/User.model';
import { UserBase } from '../Models/User/UserBase.model';

import { UserService } from '../Services/user.service';
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';

import { SocialAuthService, GoogleLoginProvider, SocialUser, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import * as $ from 'jquery';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent {

  matcher: MyErrorStateMatcher;

  btnSignInTitle = 'Sign In';
  btnSignInDisabled = false;

  btnForgetPwdTitle = 'Reset Password';
  btnForgetPwdDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    private userService: UserService, private sharedService: SharedService,
    private localStorageService: LocalStorageService, private socialAuthService: SocialAuthService,
    private router: Router
  ) {
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required]);

    this.matcher = new MyErrorStateMatcher();

    this.formGroup = new FormGroup({ email: this.emailFormControl, password: this.passwordControl });
  }

  ngOnInit(): void {
    $("#divMainSearchBox").hide();

    this.localStorageService.removeData("CurrentUser");
    this.localStorageService.removeData("Token");
    setTimeout(() => { this.sharedService.UpdateUserSignedIn(false); }, 100);

    this.socialAuthService.authState.subscribe((user) => {
      debugger;
    });
  }

  formGroup: FormGroup;
  emailFormControl: FormControl;
  passwordControl: FormControl;


  public user: User = new User;
  public isRememberMe: boolean = false;

  public signIn() {
    let userBase: UserBase = { Username: this.emailFormControl.value, Password: this.passwordControl.value };

    this.btnSignInTitle = 'Processing...';
    this.btnSignInDisabled = true;

    this.userService.signIn(userBase).subscribe((result) => {
      if (result == -1) {
        alert("Sorry, not found email or password was wrong. Please try again.");
      } else {
        //save token to local storage
        this.localStorageService.saveData('Token', result);

        //get user profile
        this.userService.getUserProfile().subscribe((user) => {
          if (user == -1) {
            alert("Sorry, not found email or password was wrong. Please try again.");
          } else {
            this.sharedService.UpdateCurrentUser(user);
            this.sharedService.UpdateUserSignedIn(true);

            //save current user to local storage
            this.localStorageService.saveData('CurrentUser', user);

            $("#divMainSearchBox").show();

            //go to home page
            this.router.navigate(['/Dashboard']);

            this.dialogRef.close();
          }
        });


      }

      this.btnSignInTitle = 'Sign In';
      this.btnSignInDisabled = false;
    });

  }

  forgotPassword() {
    $("#formLogin").hide();
    $("#divForgetPasswordLink").hide();
    $("#divRememberMe").hide();
    $("#divSignIn").hide();
    $("#divForgetPasswordForm").show();
  }

  public userEmail: string = "";

  sendForgetPasswordEmail() {

    this.btnForgetPwdTitle = 'Processing...';
    this.btnForgetPwdDisabled = true;

    this.userService.forgetPassword(this.userEmail).subscribe(() => {
      alert("A [Forget Password] email was sent to your email address, please click the link to reset password.");

      this.dialogRef.close();
    });
  }

  createAccount(){ this.dialogRef.close('register'); }


}
