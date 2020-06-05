import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { Maze, Cell, keyboardMap, MazeDrawingBoard, Level } from './models';
import { Router, ActivatedRoute } from '@angular/router';
import { MazeStoreService } from './services/maze-store.service';
import { sampleData } from './models/levels';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent implements OnInit, OnDestroy, AfterViewInit {
  row: number;
  col: number;
  hasSolved = false;
  private maze: Maze;
  private drawingBoard: MazeDrawingBoard;
  private currentLevel: Level;
  showTestButton = false;
  private subs = new Subscription();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: MazeStoreService
  ) { }

  ngOnInit(): void {
    // if (!environment.production) {
    //   this.showTestButton = true;
    // }
    this.initMaze();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  ngAfterViewInit() {
    const canvas = (document.getElementById('maze') as HTMLCanvasElement);
    const ctx = canvas.getContext('2d');
    if (this.maze) {
      this.drawingBoard = new MazeDrawingBoard(this.maze);
      this.drawingBoard.canvas = canvas;
      this.drawingBoard.ctx = ctx;
      if (this.hasSolved) {
        this.existineGame();
      } else {
        this.newGame();
      }
    }
  }
  goBackToHome() {
    this.router.navigate(['home']);
  }
  goToNextLevel() {
    this.currentLevel = { ...this.currentLevel, completed: true, maze: this.maze };
    this.storeService.addCompleted(this.currentLevel);
    let nextLevel: Level;
    if (this.currentLevel.id < sampleData[sampleData.length - 1].id) {
      nextLevel = sampleData.find(f => f.id === (this.currentLevel.id + 1));
    } else {
      nextLevel = new Level();
    }

    this.storeService.addCurrent(nextLevel);
    this.router.navigate(['home']);
  }
  newGame() {
    this.drawingBoard.drawMaze(this.row, this.col);
  }
  existineGame() {
    this.hasSolved = true;
    this.drawingBoard.drawMaze(this.row, this.col);
    this.drawSolution();
  }
  initMaze() {

    const id = this.route.snapshot.params['id'];
    // this.currentLevel = sampleData.find(f => f.id.toString() === id);
    this.subs.add(this.storeService.dataStore
      //   .pipe(
      //   map(res => res.levels.find(item => item.id === res.current.id))
      // )
      .subscribe(res => {
        const current = sampleData.find(f => f.id === res.current?.id);
        if (current) {
          this.currentLevel = { ...current };
          const solved = res.levels.find(item => item.id.toString() === id);
          if (solved) {
            this.initComponentVariables(solved.row, solved.col, solved.maze, true);
          } else {
            // tslint:disable-next-line: max-line-length
            this.initComponentVariables(this.currentLevel.row, this.currentLevel.col, new Maze(this.currentLevel.row, this.currentLevel.col));
          }
        }
      })
    );

  }
  private initComponentVariables(row: number, col: number, maze: Maze, hasSolved: boolean = false) {
    this.row = row;
    this.col = col;
    this.maze = maze;
    this.hasSolved = hasSolved;
  }
  drawMaze() {
    const canvas = (document.getElementById('maze') as HTMLCanvasElement);
    const ctx = canvas.getContext('2d');
<<<<<<< HEAD
    this.maze = new Maze(this.row, this.col);
=======
    this.maze = new Maze(this.row, this.col)
>>>>>>> 9523ea9... Code refractoring
    this.drawingBoard = new MazeDrawingBoard(this.maze);
    this.drawingBoard.canvas = canvas;
    this.drawingBoard.ctx = ctx;
    this.drawingBoard.drawMaze(this.row, this.col);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.hasSolved) { return; }
    const direction = keyboardMap[event.key];
    if (direction) {
      this.move(direction);
      event.preventDefault();
    }
  }
  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    /*call move method here
    * check if completed then draw solution
    */
    this.drawingBoard.move(direction);
    if (this.drawingBoard.completed) {
      this.hooray();
      this.drawSolution();
      this.goToNextLevel();
    }
  }
  clearMyPath() {
    if (!this.hasSolved) {
      // call clear path method here
      this.drawingBoard.clearPath();
    }
  }

  drawSolution() {
    this.hasSolved = true;
    // call draw solution method here
    this.drawingBoard.drawSolution();
  }


  private hooray() {
    const audio = new Audio('assets/KidsCheering.mp3');
    audio.play();
  }

  private validateInputs() {
    // if (isNaN(this.row) || this.row < 1 || this.row > 100) {
    //   alert('Please enter a positive number for #Rows.');
    //   this.row = 15;
    // }
    // if (isNaN(this.col) || this.col < 1 || this.col > 100) {
    //   alert('Please enter a positive number for #Columns.');
    //   this.col = 15;
    // }
    // // tslint:disable-next-line: no-bitwise
    // this.row = ~~this.row;
    // // tslint:disable-next-line: no-bitwise
    // this.col = ~~this.col;
  }
  test() {
    const cellsHaveFourEdges: Cell[] = [];
    let hasLoop = false;
    const size = 50;
    for (let i = 0; i < 100; i++) {
      const maze = new Maze(size, size);
      maze.cells.forEach(row =>
        row.forEach(c => {
          if (c.nEdges === 4) {
            cellsHaveFourEdges.push(c);
          }
          if (c.col < size - 1 && c.row < size - 1) {
            if (!c.eastEdge && !c.southEdge) {
              const cellOnTheRight = maze.cells[c.row][c.col + 1];
              if (!cellOnTheRight.southEdge) {
                const cellBelow = maze.cells[c.row + 1][c.col];
                if (!cellBelow.eastEdge) {
                  hasLoop = true;
                }
              }
            }
          }
        })
      );
      if (cellsHaveFourEdges.length) {
        alert('dead loop');
        break;
      }
      if (hasLoop) {
        alert('open loop');
        break;
      }
    }

    console.log(`testing has finished`);
  }
}
