import { Maze } from './maze.model';
import { Cell } from './cell.model';

export class MazeDrawingBoard {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public completed: boolean;
  private maze: Maze;
  private myPath: Cell[] = [];
  private currentCell: Cell;
  private col: number;
  private row: number;
  private canvasWidth = 350;
  private canvasHeight = 350;
  private cellSize: number; // length of cell edge
  private readonly cellEdgeThickness: number; // thickness of cell edge
  private readonly cellBackground: string;
  private readonly solutionPathColor: string;
  private readonly myPathColor: string;
  private myPathThickness: number;
  private solutionPathThickness: number;
  constructor(
    maze: Maze,
    cellSize?: number,
    cellEdgeThickness?: number,
    cellBackground?: string,
    solutionPathColor?: string,
    myPathColor?: string,
    solutionPathThickness?: number,
    myPathThickness?: number,
  ) {
    this.maze = maze;
    this.cellSize = cellSize || 20;
    this.cellEdgeThickness = cellEdgeThickness || 2;
    this.cellBackground = cellBackground || '#FFFFFF';
    this.solutionPathColor = solutionPathColor || '#ff4081';
    this.myPathColor = myPathColor || '#3f51b5';
    this.solutionPathThickness = solutionPathThickness || 3;
    this.myPathThickness = myPathThickness || 10;
  }
  drawMaze(row: number, col: number) {
    [this.row, this.col] = [row, col];
    this.canvas.width = this.canvasWidth; // col * this.cellSize;
    this.canvas.height = this.canvasHeight; // row * this.cellSize;
    this.cellSize = Math.floor(this.canvasWidth / col);
    this.myPathThickness = this.cellSize / 2;
    this.solutionPathThickness = Math.floor(this.myPathThickness / 3);
    // open the first and last cells to show the entrance and exit
    this.maze.firstCell.westEdge = false;
    this.maze.lastCell.eastEdge = false;

    // draw the cells
    this.ctx.lineWidth = this.cellEdgeThickness;
    this.ctx.fillStyle = this.cellBackground;
    this.maze.cells.forEach(x => x.forEach(c => this.draw(c)));
    this.initPlay();
  }
  initPlay() {
    // this.hasSolved = false;
    this.myPath.length = 0;
    this.currentCell = this.maze.firstCell; // reset myPath position
    this.myPath.push(this.currentCell);

    // draw the initial step of myPath in the first Cell as entrance
    this.ctx.lineWidth = this.myPathThickness;
    this.ctx.strokeStyle = this.myPathColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
  }
  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    let nextCell: Cell;
    if (direction === 'Left') {
      if (this.currentCell.col < 1) { return; }
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col - 1
      ];
    }
    if (direction === 'Right') {
      if (this.currentCell.col + 1 >= this.col) { return; }
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col + 1
      ];
    }
    if (direction === 'Up') {
      if (this.currentCell.row < 1) { return; }
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
      ];
    }
    if (direction === 'Down') {
      if (this.currentCell.row + 1 >= this.row) { return; }
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
      ];
    }

    if (this.currentCell.isConnectedTo(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        // this is a step back; reverse the step by erasing the original path
        this.drawPath(this.myPath, this.cellBackground);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(this.maze.lastCell)) {
          this.completed = true;
          return;
        }
      }

      this.drawPath(this.myPath);
      this.currentCell = nextCell;
    }
  }
  drawSolution() {
    this.drawPath(this.maze.findPath(), this.solutionPathColor, this.solutionPathThickness, true);
  }
  clearPath() {

    this.drawPath(this.myPath, this.cellBackground);
    this.initPlay();

  }
  private drawPath(
    path: Cell[],
    color = this.myPathColor,
    lineThickness = this.myPathThickness,
    drawSolution = false
  ) {
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);

    path.forEach(x =>
      this.ctx.lineTo(
        (x.col + 0.5) * this.cellSize,
        (x.row + 0.5) * this.cellSize
      )
    );
    if (drawSolution) {
      this.ctx.lineTo(
        this.col * this.cellSize,
        (this.row - 0.5) * this.cellSize
      );
    }
    this.ctx.stroke();
  }
  private draw(cell: Cell) {
    this.ctx.fillRect(
      cell.col * this.cellSize,
      cell.row * this.cellSize,
      (cell.col + 1) * this.cellSize,
      (cell.row + 1) * this.cellSize
    );
    if (cell.northEdge) {
      this.ctx.beginPath();
      this.ctx.moveTo(cell.col * this.cellSize, cell.row * this.cellSize);
      this.ctx.lineTo((cell.col + 1) * this.cellSize, cell.row * this.cellSize);
      this.ctx.stroke();
    }
    if (cell.eastEdge) {
      this.ctx.beginPath();
      this.ctx.moveTo((cell.col + 1) * this.cellSize, cell.row * this.cellSize);
      this.ctx.lineTo(
        (cell.col + 1) * this.cellSize,
        (cell.row + 1) * this.cellSize
      );
      this.ctx.stroke();
    }
    if (cell.southEdge) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        (cell.col + 1) * this.cellSize,
        (cell.row + 1) * this.cellSize
      );
      this.ctx.lineTo(cell.col * this.cellSize, (cell.row + 1) * this.cellSize);
      this.ctx.stroke();
    }
    if (cell.westEdge) {
      this.ctx.beginPath();
      this.ctx.moveTo(cell.col * this.cellSize, (cell.row + 1) * this.cellSize);
      this.ctx.lineTo(cell.col * this.cellSize, cell.row * this.cellSize);
      this.ctx.stroke();
    }
  }
}
