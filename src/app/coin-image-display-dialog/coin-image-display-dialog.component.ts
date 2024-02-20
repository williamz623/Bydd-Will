import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CoinImageDisplayDialogComponentData { CoinImage: string }

@Component({
  selector: 'app-coin-image-display-dialog',
  templateUrl: './coin-image-display-dialog.component.html',
  styleUrls: ['./coin-image-display-dialog.component.scss']
})
export class CoinImageDisplayDialogComponent {

  coinImage:string='';

  constructor(
    public dialogRef: MatDialogRef<CoinImageDisplayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoinImageDisplayDialogComponentData
  ) {
    this.coinImage=data.CoinImage;
  }


  close() { this.dialogRef.close(); }
}
