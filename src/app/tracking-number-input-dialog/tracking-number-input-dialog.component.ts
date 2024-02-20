import { Component, Inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coin } from '../Models/Coin/Coin.model';
import { User } from '../Models/User/User.model';
import { CoinShipping } from '../Models/Coin/CoinShipping.model';

import { CoinService } from '../Services/coin.service'
import { Router } from '@angular/router';
import { SharedService } from '../Services/shared.service';
import { LocalStorageService } from '../Services/localStorage.service';
import { UserService } from '../Services/user.service';

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as moment from 'moment';

export interface TrackingNumberInputDialogComponentData { Coin: Coin, UserId: number }

@Component({
  selector: 'app-tracking-number-input-dialog',
  templateUrl: './tracking-number-input-dialog.component.html',
  styleUrls: ['./tracking-number-input-dialog.component.scss']
})
export class TrackingNumberInputDialogComponent {

  currentCoin!:Coin;
  coinShipping:CoinShipping=new CoinShipping();

  carriers = ['', 'Canada Post', 'UPS', 'Fedex', 'DHL', 'USPS', 'Asendia', 'Others'];

  constructor(
    public dialogRef: MatDialogRef<TrackingNumberInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrackingNumberInputDialogComponentData,
    private sharedService: SharedService, private userService: UserService, private coinService: CoinService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.currentCoin=data.Coin;
    this.coinShipping.userId = data.UserId;
    this.coinShipping.coinId = this.currentCoin.coinId;
  }

  close() { this.dialogRef.close(); }

  //submit
  public submit() {

    if (this.coinShipping.carrierName.trim() == '' || this.coinShipping.trackingNumber.trim() == '') {
      alert("[Carrier] and [TrackingNumber] were not allowed empty.");
    } else {
      this.coinService.updateTrackingNumber(this.coinShipping).subscribe((data) => {
        const result = data;
        alert("Submit succeeded.");
        this.dialogRef.close(this.coinShipping);
      });
    }

  }
}
