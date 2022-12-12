import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.split('').map(item => {
  if(item.charCodeAt(0) >= 97 && item.charCodeAt(0) <= 122) {
    return item.charCodeAt(0) - 96
  } else if(item === "S") {
    return 0;
  } else {
    return 27;
  }
}));

const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val));


const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const values = initialize2DArray(input[0].length, input.length, 9999);
  const startValueRow = input.findIndex(row => row.includes(0));
  const startValue = [startValueRow, input[startValueRow].findIndex(item => item === 0)];
  const endValueRow = input.findIndex(row => row.includes(27));
  const endValue = [endValueRow, input[endValueRow].findIndex(item => item === 27)];
  values[startValue[0]][startValue[1]] = 0;
  input[startValue[0]][startValue[1]] = 1;
  input[endValue[0]][endValue[1]] = 26;

  const findPathsFromPos = (x: number, y: number, distance: number) => {
    if(y > 0 && input[x][y - 1] <= input[x][y] + 1 && values[x][y - 1] > distance + 1) {
      values[x][y - 1] = distance + 1;
      findPathsFromPos(x, y - 1, distance + 1);
    }
    if(x > 0 && input[x - 1][y] <= input[x][y] + 1 && values[x - 1][y] > distance + 1) {
      values[x - 1][y] = distance + 1;
      findPathsFromPos(x - 1, y, distance + 1);
    } 
    if(x < input.length - 1 && input[x + 1][y] <= input[x][y] + 1 && values[x + 1][y] > distance + 1) {
      values[x + 1][y] = distance + 1;
      findPathsFromPos(x + 1, y, distance + 1);
    } 
    if(y < input[0].length - 1 && input[x][y + 1] <= input[x][y] + 1 && values[x][y + 1] > distance + 1) {
      values[x][y + 1] = distance + 1;
      findPathsFromPos(x, y + 1, distance + 1);
    } 
  }

  findPathsFromPos(startValue[0], startValue[1], 0)
  //console.log(values);

  return values[endValue[0]][endValue[1]] as number;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const values = initialize2DArray(input[0].length, input.length, 9999);
  const startValueRow = input.findIndex(row => row.includes(0));
  const startValue = [startValueRow, input[startValueRow].findIndex(item => item === 0)];
  const endValueRow = input.findIndex(row => row.includes(27));
  const endValue = [endValueRow, input[endValueRow].findIndex(item => item === 27)];
  values[startValue[0]][startValue[1]] = 0;
  input[startValue[0]][startValue[1]] = 1;
  input[endValue[0]][endValue[1]] = 26;
  input.forEach((row, xIndex) => {
    row.forEach((item, yIndex) => {
      if(item === 1) {
        values[xIndex][yIndex] === 0;
      }
    })
  })

  const findPathsFromPos = (x: number, y: number, distance: number) => {
    if(y > 0 && input[x][y - 1] <= input[x][y] + 1 && values[x][y - 1] > distance + 1) {
      values[x][y - 1] = distance + 1;
      findPathsFromPos(x, y - 1, distance + 1);
    }
    if(x > 0 && input[x - 1][y] <= input[x][y] + 1 && values[x - 1][y] > distance + 1) {
      values[x - 1][y] = distance + 1;
      findPathsFromPos(x - 1, y, distance + 1);
    } 
    if(x < input.length - 1 && input[x + 1][y] <= input[x][y] + 1 && values[x + 1][y] > distance + 1) {
      values[x + 1][y] = distance + 1;
      findPathsFromPos(x + 1, y, distance + 1);
    } 
    if(y < input[0].length - 1 && input[x][y + 1] <= input[x][y] + 1 && values[x][y + 1] > distance + 1) {
      values[x][y + 1] = distance + 1;
      findPathsFromPos(x, y + 1, distance + 1);
    } 
  }

  input.forEach((row, xIndex) => {
    row.forEach((item, yIndex) => {
      if(item === 1) {
        findPathsFromPos(xIndex, yIndex, 0);
      }
    })
  })


  return values[endValue[0]][endValue[1]] as number;
};

run({
  part1: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
        `,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
        `,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
