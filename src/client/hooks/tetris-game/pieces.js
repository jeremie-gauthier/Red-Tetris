import { deepCopy } from "helpers/functional";
import { isFree, isBottomLine } from "./grid";

// TODO: check if the piece can be inserted
export function insertPiece(piece, grid, midGrid) {
  const gridCopy = deepCopy(grid);
  const insertPos = midGrid - Math.ceil(piece[0].length / 2);

  const colLength = piece[0].length;
  const rowLength = piece.length;
  for (let col = 0; col < colLength; col++) {
    for (let row = 0; row < rowLength; row++) {
      gridCopy[row][insertPos + col] = piece[row][col];
    }
  }
  return gridCopy;
}

function isPartOfPiece(element) {
  return element === 1;
}

function canMove(grid, colLength, rowLength) {
  for (let col = 0; col < colLength; col++) {
    for (let row = 0; row < grid.length; row++) {
      if (
        isPartOfPiece(grid[row][col]) &&
        (isBottomLine(grid, row) || !isFree(grid, row, col))
      ) {
        canMoveDown = false;
      }
    }
  }
  return canMoveDown;
}

export function moveDown(grid, colLength, rowLength) {
  const gridCopy = deepCopy(grid);

  if (!canMove(gridCopy, colLength, rowLength)) {
    return null;
  }

  for (let col = 0; col < colLength; col++) {
    for (let row = rowLength - 1; row >= 0; row--) {
      if (isPartOfPiece(gridCopy[row][col])) {
        gridCopy[row][col] = 0;
        gridCopy[row + 1][col] = 1;
      }
    }
  }
  return gridCopy;
}

export function putTetromino(tetromino, grid) {
  const gridCopy = deepCopy(grid);

  return gridCopy.map((row) =>
    row.map((col) => (col === 1 ? tetromino.color : col)),
  );
}
