import { Injectable } from '@angular/core';
import { Level } from '../models/level.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MazeStoreService {
  private _dataStore: BehaviorSubject<{ levels: Level[], current: Level }> = new BehaviorSubject({ levels: [], current: new Level() });
  private dataStoreObj: { levels: Level[], current: Level } = { levels: [], current: null }; // store our data in memory
  public readonly dataStore: Observable<{ levels: Level[], current: Level }> = this._dataStore.asObservable();
  constructor() { }

  addCurrent(level: Level) {
    this.dataStoreObj.current = level;
    this._dataStore.next(Object.assign({}, this.dataStoreObj));
  }
  addCompleted(level: Level) {
    this.dataStoreObj.levels.push(level);
    this._dataStore.next(Object.assign({}, this.dataStoreObj));
  }
  reset() {
    this.dataStoreObj = { levels: [], current: null };
    this._dataStore.next(Object.assign({}, this.dataStoreObj));
  }
}
