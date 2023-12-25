import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private readonly cryptoKey = '4ng9ol13r-a1023'

  constructor(
    private readonly _snackBar: MatSnackBar
  ) { }

  public openSnackBar(message: string): void {
    this._snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar'],
    });
  }

  public encrypt(text: string): string {
    const cipher = CryptoJS.AES.encrypt(text, this.cryptoKey);
    return cipher.toString();
  }

  public decrypt(text: string ): string {
    const bytes  = CryptoJS.AES.decrypt(text, this.cryptoKey);
    return bytes.toString();
  }

}
