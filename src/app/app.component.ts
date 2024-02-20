import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { User } from './Models/User/User.model';
import { SharedService } from './Services/shared.service';
import { LocalStorageService } from './Services/localStorage.service';

import { MatDialog } from '@angular/material/dialog';
import { UserRegisterDialogComponent } from './user-register-dialog/user-register-dialog.component';
import { RegisterSucceedDialogComponent } from './register-succeed-dialog/register-succeed-dialog.component';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';

import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //title = 'BYDWeb';
  userSignedIn = false;
  currentUser?: User | null;
  selectedCategoryId: number = 0;
  searchKeyword: string = '';
  searchButtonDisabled: boolean = false;
  searchButtonTitle: string = "Search";


  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute,
    private sharedService: SharedService, private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.sharedService.UserSignedIn$.subscribe(newValue => { this.userSignedIn = newValue; });
    this.sharedService.CurrentUser$.subscribe(newValue => { this.currentUser = newValue; });
  }

  gotoRouter(routerName: string) {
    if (this.userSignedIn || routerName == 'CoinList' || routerName == 'AboutUs')
      this.router.navigate(['/' + routerName]);
    else
      this.router.navigate(['/Login']);
  }

  gotoHome() {
    this.selectedCategoryId = 0;
    this.searchKeyword = "";
    this.router.navigate(['/Home']);
  }

  logout() {
    this.localStorageService.removeData("CurrentUser");
    this.localStorageService.removeData("Token");
    this.sharedService.UpdateUserSignedIn(false);
    this.userSignedIn = false;

    this.router.navigate(['/Home']);
  }

  login() { this.router.navigate(['/Login']); }

  signIn() {
    if (window.innerWidth <= 640) {
      const dialogRef = this.dialog.open(SignInDialogComponent, { width: '100%', height: '50%', maxWidth: '100%' });
      dialogRef.afterClosed().subscribe(result => { this.gotoNextStep(result); });
    } else {
      if (window.innerWidth <= 960) {
        const dialogRef = this.dialog.open(SignInDialogComponent, { width: '50%', height: '60%' });
        dialogRef.afterClosed().subscribe(result => { this.gotoNextStep(result); });
      } else {
        const dialogRef = this.dialog.open(SignInDialogComponent, { width: '30%', height: '60%' });
        dialogRef.afterClosed().subscribe(result => { this.gotoNextStep(result); });
      }
    }
  }

  gotoNextStep(nextStepName:string){
    if (nextStepName=='register')
      this.register();

    if (nextStepName == 'Register Succeeded')
      this.openRegisterSucceedDialog();

    if (nextStepName == 'signin')
      this.signIn();
  }

  helpContact() { this.router.navigate(['/HelpContact']); }

  userAgreement() { this.router.navigate(['/UserAgreement']); }

  register() {
    if (window.innerWidth <= 600) {
      const dialogRef = this.dialog.open(UserRegisterDialogComponent, { width: '100%', height: '80%', maxWidth: '100%' });
      dialogRef.afterClosed().subscribe(result => { this.gotoNextStep(result); });
    } else {
      const dialogRef = this.dialog.open(UserRegisterDialogComponent, { width: '50%', height: '80%' });
      dialogRef.afterClosed().subscribe(result => { this.gotoNextStep(result); });
    }
  }

  openRegisterSucceedDialog(){
    const dialogRef = this.dialog.open(RegisterSucceedDialogComponent, { width: '300px', height: '300px' });
    dialogRef.afterClosed().subscribe(result => { this.gotoNextStep(result); });
  }

  searchCoins() {
    this.searchButtonTitle = 'Processing...';
    this.searchButtonDisabled = true;
    const navigationExtras: NavigationExtras = { queryParams: { sw: this.selectedCategoryId + "^" + this.searchKeyword } };
    this.router.navigate(['/CoinList'], navigationExtras);

    setTimeout(() => {
      this.searchButtonTitle = "Search";
      this.searchButtonDisabled = false;
    }, 750);
  }
}
