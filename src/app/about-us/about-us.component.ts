import { Component } from '@angular/core';
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {

  constructor(
    private sharedService: SharedService, private localStorageService: LocalStorageService
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
