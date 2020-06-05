import { Maze } from './maze.model';
import { sampleData } from './levels';

export class Level {
  id: number;
  name: string;
  row: number;
  col: number;
  completed: boolean;
  maze: Maze;
  constructor() {
    this.id = sampleData[0].id;
    this.name = sampleData[0].name;
    this.row = sampleData[0].row;
    this.col = sampleData[0].col;
    this.completed = sampleData[0].completed;
    this.maze = sampleData[0].maze;
  }
}
