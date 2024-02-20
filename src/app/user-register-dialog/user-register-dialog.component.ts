import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../Models/User/User.model';

import { UserService } from '../Services/user.service';

import { Router } from '@angular/router';

export function firstLetterAlphaValidator(control: AbstractControl) {
  const value = control.value;
  const pattern = /^[a-zA-Z][a-zA-Z0-9]*$/;

  if (!value) {
    return null;
  }
  return pattern.test(value) ? null : { firstLetterAlpha: true };
}

export function phoneValidator(control: AbstractControl) {
  const value = control.value;
  const pattern = /^\+?[1]?\(?\d{3}\)?\d{3}-?\d{4}$/;

  if (!value) { return null; }
  return pattern.test(value) ? null : { invalidPhone: true };
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-user-register-dialog',
  templateUrl: './user-register-dialog.component.html',
  styleUrls: ['./user-register-dialog.component.scss']
})
export class UserRegisterDialogComponent {

  formGroup: FormGroup;

  displayNameControl: FormControl;
  emailFormControl: FormControl;
  passwordControl: FormControl;
  firstNameFormControl: FormControl;
  lastNameFormControl: FormControl;
  phoneControl: FormControl;
  address1Control: FormControl;
  address2Control: FormControl;
  cityControl: FormControl;
  provinceControl: FormControl;
  postalCodeControl: FormControl;
  countryControl: FormControl;

  matcher: MyErrorStateMatcher;

  public user: User = new User;

  countries: any[] = [{ countryCode: 'CA', countryName: 'Canada' }, { countryCode: 'US', countryName: 'USA' }]
  currentCountry = { countryCode: '', countryName: '' };

  btnSubmitTitle = 'Submit';
  btnSubmitDisabled = false;

  constructor(
    public dialogRef: MatDialogRef<UserRegisterDialogComponent>,
    private userService: UserService,
    private router: Router
  ) {
    this.displayNameControl = new FormControl('');
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', [Validators.required, firstLetterAlphaValidator]);
    this.phoneControl = new FormControl('', [phoneValidator]);
    this.firstNameFormControl = new FormControl('', [Validators.required]);
    this.lastNameFormControl = new FormControl('', [Validators.required]);
    this.address1Control = new FormControl('');
    this.address2Control = new FormControl('');
    this.cityControl = new FormControl('');
    this.provinceControl = new FormControl('');
    this.postalCodeControl = new FormControl('');
    this.countryControl = new FormControl('');

    this.matcher = new MyErrorStateMatcher();

    this.formGroup = new FormGroup({
      email: this.emailFormControl,
      password: this.passwordControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      displayNameControl: this.displayNameControl,
      phone: this.phoneControl
    });
  }

  ngOnInit(): void {
    this.userService.getCountries().subscribe((data) => { this.countries = data; });
  }

  closeDialog(): void { this.dialogRef.close(); }

  addNewUser() {
    this.btnSubmitTitle = 'Processing...';
    this.btnSubmitDisabled = true;

    this.userService.checkUserExisted(this.emailFormControl.value).subscribe((result) => {
      if (result == 1) {
        alert("The [Email] was existed, please change it and try again. Thanks. ");
      } else {
        if (this.currentCountry.countryName == '') {
          alert("Please select your [Country].");
        } else {
          this.user.email = this.emailFormControl.value;
          this.user.password = this.passwordControl.value;
          this.user.phone = this.phoneControl.value;
          this.user.firstName = this.firstNameFormControl.value;
          this.user.lastName = this.lastNameFormControl.value;
          this.user.displayName = this.displayNameControl.value;
          this.user.address1 = this.address1Control.value;
          this.user.address2 = this.address2Control.value;
          this.user.city = this.cityControl.value;
          this.user.province = this.provinceControl.value;
          this.user.postalCode = this.postalCodeControl.value;
          this.user.country = this.currentCountry.countryName;
          this.user.countryCode = this.currentCountry.countryCode;

          this.userService.addNewUser(this.user).subscribe((result) => { this.dialogRef.close('Register Succeeded'); });
        }
      }

      this.btnSubmitTitle = 'Submit';
      this.btnSubmitDisabled = false;
    });
  }
}


