import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slider } from './shared/animation/route-animation';
import { AppUpdateService } from './maze/services/app-update.service';

@Component({
  selector: 'app-root',
  animations: [
    slider
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'perfect-maze';
  constructor(private appUpdateService: AppUpdateService) {

  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
