import React from "react";
import TETROMINOES from "../../../config/models/piece";

const lengthMockTetrominoes = TETROMINOES.length;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function fetchFromMock(n) {
  const ret = [];
  for (let i = 0; i < n; i++) {
    ret.push(TETROMINOES[getRandomInt(lengthMockTetrominoes)]);
  }

  return ret;
}

export function useNextPiecesSolo() {
  const [nextPieces, setNextPieces] = React.useState(() => fetchFromMock(3));

  function pullNextPiece() {
    let nextPiece;

    setNextPieces((oldPieces) => {
      nextPiece = oldPieces[0];
      const fetchedPiece = fetchFromMock(1);
      return [...oldPieces.slice(1), ...fetchedPiece];
    });

    return nextPiece;
  }

  return {
    nextPieces,
    pullNextPiece,
  };
}

export default useNextPiecesSolo;
