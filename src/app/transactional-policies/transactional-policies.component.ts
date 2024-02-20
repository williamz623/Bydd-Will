import { Component, ViewChild } from '@angular/core';
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';
import { UserService } from '../Services/user.service';
import { User } from '../Models/User/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactional-policies',
  templateUrl: './transactional-policies.component.html',
  styleUrls: ['./transactional-policies.component.scss']
})
export class TransactionalPoliciesComponent {

  userSignedIn: boolean = false;
  currentUser?: User | null;

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
  }

}
