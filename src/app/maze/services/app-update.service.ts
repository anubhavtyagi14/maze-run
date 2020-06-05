import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(
    private readonly updates: SwUpdate,
    private snackBar: MatSnackBar) {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => {
        this.showAppUpdateAlert();
      });
    }

  }
  showAppUpdateAlert() {
    const message = 'App Update available. Choose Ok to update';
    let snackBarRef = this.snackBar.open(message, 'Ok', {
      duration: 3000,
    });
    snackBarRef.onAction().subscribe(() => {
      this.doAppUpdate();
    });
  }
  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }


}
