import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.split('').map(item => +item));

const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const visibilityMap: Array<Array<number>> = initialize2DArray(input.length, input[0].length, 0) as Array<Array<number>>;
  for(let x = 0; x < input.length; x++) {
    for(let y = 0; y < input[0].length; y++) {
      if(x === 0) {
        visibilityMap[x][y] += 1;
      }
      if(y === 0) {
        visibilityMap[x][y] += 1;
      }
      if(x === input.length - 1) {
        visibilityMap[x][y] += 1;
      }
      if(y === input[0].length - 1) {
        visibilityMap[x][y] += 1;
      }
      const row = input[x];
      const column = input.map(row => row[y]);
      if(!row.slice(0, y).some(num => num >= input[x][y])) {
        visibilityMap[x][y] += 1;
      }
      if(!row.slice(y + 1).some(num => num >= input[x][y])) {
        visibilityMap[x][y] += 1;
      }
      if(!column.slice(0, x).some(num => num >= input[x][y])) {
        visibilityMap[x][y] += 1;
      }
      if(!column.slice(x + 1).some(num => num >= input[x][y])) {
        visibilityMap[x][y] += 1;
      }
    }
  }

  return visibilityMap.flat().filter(num => num !== 0).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const scenicMap: Array<Array<number>> = initialize2DArray(input.length, input[0].length, 1) as Array<Array<number>>;

  const visibilityCount = (array: Array<number>): number => {
    let arrayVisibility = 0;
    for(let i = 1; i < array.length; i++) {
      arrayVisibility++;

      if(array[0] <= array[i]) {
        break;
      }
    }
    return arrayVisibility === 0 ? 1 : arrayVisibility;
  }

  for(let x = 0; x < input.length; x++) {
    for(let y = 0; y < input[0].length; y++) {
      if(x === 0 || y === 0 || x === input.length - 1 || y === input[0].length - 1) {
        scenicMap[x][y] = 0;
      } else {
        const rowLeft = input[x].slice(0, y + 1).reverse();
        let rowLeftVisibility = visibilityCount(rowLeft);

        const rowRight = input[x].slice(y);
        let rowRightVisibility = visibilityCount(rowRight);

        const columnUp = input.map(row => row[y]).slice(0, x + 1).reverse();
        let columnUpVisibility = visibilityCount(columnUp);

        const columnDown = input.map(row => row[y]).slice(x);
        let columnDownVisibility = visibilityCount(columnDown);

        scenicMap[x][y] = columnDownVisibility * columnUpVisibility * rowLeftVisibility * rowRightVisibility;
      }
    }
  }
  return Math.max(...scenicMap.flat());
};

run({
  part1: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
