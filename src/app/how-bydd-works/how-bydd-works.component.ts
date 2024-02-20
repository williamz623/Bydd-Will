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
  selector: 'app-how-bydd-works',
  templateUrl: './how-bydd-works.component.html',
  styleUrls: ['./how-bydd-works.component.scss']
})
export class HowByddWorksComponent {

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
