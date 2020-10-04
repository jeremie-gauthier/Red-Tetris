import * as Check from "./checks";
import { CURRENT_PIECE, SHADOW_PIECE } from "../constants";

function shadowCanBeDraw(grid, coord) {
  return grid[coord.y][coord.x] !== CURRENT_PIECE;
}

function canPaintPartOfPiece(grid, coord, type) {
  const { x, y } = coord;

  return (
    type !== SHADOW_PIECE ||
    (type === SHADOW_PIECE && shadowCanBeDraw(grid, { x, y }))
  );
}

/*
 ** Write a piece on the Tetris grid.
 ** Type can be one of the following constants:
 **   - CURRENT_PIECE
 **   - SHADOW_PIECE
 ** Or the piece.color attribute to definitely put it on the board game
 */

function write(grid, piece, type) {
  const { shape, padding, coord, dim } = piece;

  const colLength = padding.x + dim.width;
  const rowLength = padding.y + dim.height;

  for (let col = padding.x; col < colLength; col++) {
    for (let row = padding.y; row < rowLength; row++) {
      if (Check.isPartOfPiece(shape[row][col])) {
        const [x, y] = [coord.x + col, coord.y + row];

        if (canPaintPartOfPiece(grid, { x, y }, type)) {
          grid[y][x] = type;
        }
      }
    }
  }
  return grid;
}

function partialWrite(grid, piece, type, remainingHeight) {
  const { shape, padding, coord, dim } = piece;

  const drawablePartOfPiece = padding.y + dim.height - remainingHeight;
  const colLength = padding.x + dim.width;

  for (let col = padding.x; col < colLength; col++) {
    for (let row = 0; row < remainingHeight; row++) {
      if (
        Check.isPartOfPiece(shape[drawablePartOfPiece + row][col]) &&
        grid[coord.y + row][coord.x + col] !== CURRENT_PIECE
      ) {
        grid[coord.y + row][coord.x + col] = type;
      }
    }
  }
  return grid;
}

export { partialWrite };
export default write;
