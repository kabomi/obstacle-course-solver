export class Game {
    matrix: string[][];

    constructor(matrix: string[][]) {
        this.matrix = matrix;
    }

    public start() {
      if (this.matrix.length <= 1 || this.matrix[0].length <= 1) {
          throw new Error("Invalid matrix");
      }
    }
}