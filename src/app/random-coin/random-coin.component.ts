import { Component, OnInit } from '@angular/core';
import { Coin } from '../Models/Coin/Coin.model';
import { CoinService } from '../Services/coin.service';

@Component({
  selector: 'app-random-coin',
  templateUrl: './random-coin.component.html'
})
export class RandomCoinComponent implements OnInit {
  randomCoin: Coin | null = null;

  constructor(private coinService: CoinService) {}

  ngOnInit() {
    this.coinService.getCoinsInHomePage().subscribe(coins => {
      if (coins && coins.length > 0) {
        // Select a random coin
        const randomIndex = Math.floor(Math.random() * coins.length);
        this.randomCoin = coins[randomIndex];
      }
    });
  }
}
