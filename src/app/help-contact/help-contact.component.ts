import { Component, ViewChild } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { CoinService } from '../Services/coin.service'
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';
import { UserService } from '../Services/user.service';
import { User } from '../Models/User/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-contact',
  templateUrl: './help-contact.component.html',
  styleUrls: ['./help-contact.component.scss']
})
export class HelpContactComponent {

  userSignedIn: boolean = false;
  currentUser?: User | null;
  currentPageNumber: number = 1;

  contactFirstName: string = '';
  contactLastName: string = '';
  contactEmail: string = '';
  contactSubject: string = '';
  contactContent: string = '';

  btnSubmitTitle = 'Submit';
  btnSubmitDisabled = false;

  constructor(
    private sharedService: SharedService, private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {

    //check local storage to confirm if need user login
    if (this.localStorageService.getData('CurrentUser')) {
      this.sharedService.UpdateUserSignedIn(true);
      this.sharedService.UpdateCurrentUser(this.localStorageService.getData('CurrentUser'));
    }
    else {
      this.sharedService.UpdateUserSignedIn(false);
    };

    // this.formContactUs = {} as NgForm;
  }

  gotoRouter(routerName: string) { this.router.navigate(['/' + routerName]); }

  submit() {

    if (this.contactEmail.trim()=='' || this.contactContent.trim()==''){
      alert("[Your Email] or [Content] was not allowed empty.");
    } else {
      this.btnSubmitTitle = 'Processing...';
      this.btnSubmitDisabled = true;


      const contactMessage = { 
        ContactFirstName: this.contactFirstName, 
        ContactLastName: this.contactLastName, 
        ContactEmail: this.contactEmail, 
        ContactSubject: this.contactSubject,
        ContactContent: this.contactContent };
      this.userService.submitContactMessage(contactMessage).subscribe((result) => {
        alert("Your message was submit successfully.");
        this.router.navigate(['/Dashboard']);
      });
    }
  }

}
