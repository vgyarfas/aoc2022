import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("");

const linePiece = (leftEdgeX, bottomEdgeY) => [
  { x: leftEdgeX, y: bottomEdgeY },
  { x: leftEdgeX + 1, y: bottomEdgeY },
  { x: leftEdgeX + 2, y: bottomEdgeY },
  { x: leftEdgeX + 3, y: bottomEdgeY },
];
const plusPiece = (leftEdgeX, bottomEdgeY) => [
  { x: leftEdgeX + 1, y: bottomEdgeY },
  { x: leftEdgeX, y: bottomEdgeY + 1 },
  { x: leftEdgeX + 1, y: bottomEdgeY + 1 },
  { x: leftEdgeX + 2, y: bottomEdgeY + 1 },
  { x: leftEdgeX + 1, y: bottomEdgeY + 2 },
];
const edgePiece = (leftEdgeX, bottomEdgeY) => [
  { x: leftEdgeX, y: bottomEdgeY },
  { x: leftEdgeX + 1, y: bottomEdgeY },
  { x: leftEdgeX + 2, y: bottomEdgeY },
  { x: leftEdgeX + 2, y: bottomEdgeY + 1 },
  { x: leftEdgeX + 2, y: bottomEdgeY + 2 },
];
const iPiece = (leftEdgeX, bottomEdgeY) => [
  { x: leftEdgeX, y: bottomEdgeY },
  { x: leftEdgeX, y: bottomEdgeY + 1 },
  { x: leftEdgeX, y: bottomEdgeY + 2 },
  { x: leftEdgeX, y: bottomEdgeY + 3 },
];
const squarePiece = (leftEdgeX, bottomEdgeY) => [
  { x: leftEdgeX, y: bottomEdgeY },
  { x: leftEdgeX + 1, y: bottomEdgeY },
  { x: leftEdgeX, y: bottomEdgeY + 1 },
  { x: leftEdgeX + 1, y: bottomEdgeY + 1 },
];

const spawnPiece = (type, leftEdgeX, bottomEdgeY) => {
  switch (type) {
    case "line":
      return linePiece(leftEdgeX, bottomEdgeY);
    case "plus":
      return plusPiece(leftEdgeX, bottomEdgeY);
    case "edge":
      return edgePiece(leftEdgeX, bottomEdgeY);
    case "i":
      return iPiece(leftEdgeX, bottomEdgeY);
    case "square":
      return squarePiece(leftEdgeX, bottomEdgeY);
  }
};

const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val));

const part1 = (rawInput: string) => {
  const heightOfLevel = 3500;
  const cycle = 2022;
  const input = parseInput(rawInput);
  const level = initialize2DArray(7, heightOfLevel, ".");
  const pieces = ["line", "plus", "edge", "i", "square"];

  let heightToSpawn = 3;
  let nextInputIndex = 0;
  for (let i = 0; i < cycle; i++) {
    let pieceToFallCoord = {x: 2, y: heightToSpawn}; 

    let stopFalling = false;
    while (!stopFalling) {

        const checkPush = {
          y: pieceToFallCoord.y,
          x: pieceToFallCoord.x + (input[nextInputIndex % input.length] === "<"
            ? -1
            : 1),
        };

        nextInputIndex++;

        if (
          spawnPiece(
            pieces[i % pieces.length],
            checkPush.x,
            checkPush.y,
          ).every(
            (coord) =>
              coord.x >= 0 &&
              coord.x < 7 &&
              level[coord.y][coord.x] === ".",
          )
        ) {
          pieceToFallCoord = checkPush;
        }

      const checkFall = {y: pieceToFallCoord.y - 1, x: pieceToFallCoord.x};

      if (
        spawnPiece(pieces[i % pieces.length], checkFall.x, checkFall.y).every(
          (coord) => coord.y >= 0 && level[coord.y][coord.x] === ".",
        )
      ) {
        pieceToFallCoord = checkFall;
      } else {
        const finalCoords = spawnPiece(
          pieces[i % pieces.length],
          pieceToFallCoord.x,
          pieceToFallCoord.y,
        );
        finalCoords.forEach((coord) => (level[coord.y][coord.x] = "#"));
        heightToSpawn = heightOfLevel - level.slice().reverse().findIndex(row => row.some(cell => cell === "#")) + 3;
        stopFalling = true;
      }
    }
  }

  return heightToSpawn - 3;
};

const part2 = (rawInput: string) => {
  const heightOfLevel = 100000;
  const cycle = 217 + 1730;
  const input = parseInput(rawInput);
  const level = initialize2DArray(7, heightOfLevel, ".");
  const pieces = ["line", "plus", "edge", "i", "square"];

  let heightToSpawn = 3;
  let nextInputIndex = 0;
  const allHeights = [];
  for (let i = 0; i < cycle; i++) {
    let pieceToFallCoord = {x: 2, y: heightToSpawn}; 

    let stopFalling = false;
    while (!stopFalling) {

        const checkPush = {
          y: pieceToFallCoord.y,
          x: pieceToFallCoord.x + (input[nextInputIndex % input.length] === "<"
            ? -1
            : 1),
        };

        nextInputIndex++;

        if (
          spawnPiece(
            pieces[i % pieces.length],
            checkPush.x,
            checkPush.y,
          ).every(
            (coord) =>
              coord.x >= 0 &&
              coord.x < 7 &&
              level[coord.y][coord.x] === ".",
          )
        ) {
          pieceToFallCoord = checkPush;
        }

      const checkFall = {y: pieceToFallCoord.y - 1, x: pieceToFallCoord.x};

      if (
        spawnPiece(pieces[i % pieces.length], checkFall.x, checkFall.y).every(
          (coord) => coord.y >= 0 && level[coord.y][coord.x] === ".",
        )
      ) {
        pieceToFallCoord = checkFall;
      } else {
        const finalCoords = spawnPiece(
          pieces[i % pieces.length],
          pieceToFallCoord.x,
          pieceToFallCoord.y,
        );
        finalCoords.forEach((coord) => (level[coord.y][coord.x] = "#"));
        heightToSpawn = heightOfLevel - level.slice().reverse().findIndex(row => row.some(cell => cell === "#")) + 3;
        allHeights.push(heightToSpawn - 3);
        stopFalling = true;
      }
    }
  }

  const firstPart = allHeights[216];
  const pattern = allHeights[allHeights.length - 1] - allHeights[216];
  const patternEnd = allHeights[216 + 1653] - allHeights[216];
  

  // const diffs = allHeights.map((item, index, array) => index === 0 ? 0 : array[index] - array[index - 1]);
  // console.log(diffs.join(''));
  // const chunkSize = 6;
  // for (let i = 0; i < diffs.length; i += chunkSize) {
  //     const chunk = diffs.slice(i, i + chunkSize);
  //     console.log(chunk.join(''));
  // }

  // 217 eleje + 1730 * 578034681 + eleje + 1653 pattern vég

  return firstPart + pattern * 578034681 + patternEnd;
};

run({
  part1: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
      //   expected: 1514285714288,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
