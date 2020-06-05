import { Component, OnInit, OnDestroy } from '@angular/core';
import { sampleData } from '../maze/models/levels';
import { Router } from '@angular/router';
import { Level } from '../maze/models/level.model';
import { MazeStoreService } from '../maze/services/maze-store.service';
import { map } from 'rxjs/operators';
<<<<<<< HEAD
import { Subscription } from 'rxjs';
=======
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';
>>>>>>> 9523ea9... Code refractoring

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  levels: Level[];
  currentLevel: Level;
  showReset: boolean;
  private subs = new Subscription();
  constructor(
    private router: Router,
    private storeService: MazeStoreService
  ) {
  }

  ngOnInit(): void {
    this.subs.add(this.storeService.dataStore.pipe(
      map(res => {
        this.currentLevel = res.current;
        return res;
      })
    ).pipe(
      map(res => {
        const data = [...sampleData];
        data.forEach(item => item.completed = res.levels.findIndex(f => f.id === item.id) !== -1);
        return data;
      })
    ).subscribe(res => {
      this.showReset = res.every(f => f.completed);
      this.levels = res;
    })
    );
    // this.subs.add(this.l)
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  goToMaze(level: Level) {
    if (level.completed || level.id === this.currentLevel.id) {
      this.router.navigate(['maze', level.id]);
    }

  }
  reset() {
    this.storeService.reset();
  }
}
