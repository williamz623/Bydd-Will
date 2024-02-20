import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../Models/User/User.model';

import { UserService } from '../Services/user.service';
import { CoinService } from '../Services/coin.service';

import * as $ from 'jquery';
import * as _ from 'lodash';

export interface UserMessageDialogComponentData { UserId: number, CoinId: number }

@Component({
  selector: 'app-user-message-dialog',
  templateUrl: './user-message-dialog.component.html',
  styleUrls: ['./user-message-dialog.component.scss']
})

export class UserMessageDialogComponent {

  public user: User = new User;
  userId: number = 0;
  coinId: number = 0;
  userMessages: any[] = [];
  btnSendMessageTitle = 'Send';
  btnSendMessageDisabled = false;
  messageToSeller: string = '';

  constructor(
    public dialogRef: MatDialogRef<UserMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserMessageDialogComponentData,
    private userService: UserService, private coinService: CoinService
  ) {
    this.userId = data.UserId;
    this.coinId = data.CoinId;
  }

  ngOnInit(): void { 
    //set user message had read
    this.coinService.setCoinUserMessageHadRead(this.coinId, this.userId).subscribe((data) => { });

    this.loadUserMessage(); 
  }

  loadUserMessage(){
    this.coinService.getCoinUserMessage(this.coinId, this.userId).subscribe((data) => { 
      this.userMessages = data; 

      //set message content height
      let height = this.userMessages.length * 120;
      if (height>550) {
        setTimeout(() => {
          $("#divMessageContent").css("height",height+"px");
        }, 100);
      }
    });
  }

  closeDialog(): void { this.dialogRef.close(); }

  sendMessage() {

    //send message
    let msgToSeller = {
      CoinId: this.coinId, CoinName:'',
      UserId: this.userMessages[0].userId, UserEmail:'',
      SellerId: 0,
      Message: this.messageToSeller, MessageIndicator:this.userMessages[0].userId==this.userId?'S':'R',
      SellerEmail: '', UserDisplayName: '', SellerDisplayName: ''
    }

    this.userService.sendMessage(msgToSeller).subscribe((result) => {
      this.loadUserMessage();
      this.messageToSeller = '';
    });
  }

}

