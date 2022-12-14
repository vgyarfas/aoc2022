import run from "aocrunner";

const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val));

const initializeArrayWithValues = (n, val = '') =>
  Array.from({ length: n }).fill(val);

const parseInput = (rawInput: string) => {
  const coords = rawInput.split('\n').map(row => row.split(' -> ').map(item => item.split(',').map(num => +num)));

  const maxX = Math.max(...coords.map(row => row.map(item => item[0])).flat())
  const minX = Math.min(...coords.map(row => row.map(item => item[0])).flat())
  const maxY = Math.max(...coords.map(row => row.map(item => item[1])).flat())
  const minY = Math.min(...coords.map(row => row.map(item => item[1])).flat())


  const rockMap = initialize2DArray(maxX - minX + 2, maxY - Math.min(minY, 0) + 2,  ' ');
  for(let row of coords) {
    for(let i = 1; i < row.length; i++) {
      const diffX = row[i][0] - row[i - 1][0];
      const diffY = row[i][1] - row[i - 1][1];

      if(diffX < 0) {
        for(let x = row[i][0] - minX; x <= row[i - 1][0] - minX; x++) {
          rockMap[row[i][1] - Math.min(minY, 0)][x] = '#';
        }
      } else if(diffX > 0) {
        for(let x = row[i - 1][0] - minX; x <= row[i][0] - minX; x++) {
          rockMap[row[i][1] - Math.min(minY, 0)][x] = '#';
        }
      } else if(diffY < 0) {
        for(let y = row[i][1] - Math.min(minY, 0); y <= row[i - 1][1] - Math.min(minY, 0); y++) {
          rockMap[y][row[i][0] - minX] = '#';
        }
      } else if(diffY > 0) {
        for(let y = row[i - 1][1] - Math.min(minY, 0); y <= row[i][1] - Math.min(minY, 0); y++) {
          rockMap[y][row[i][0] - minX] = '#';
        }
      }
    }
  }

  return {
    rockMap,
    minX,
    minY: Math.min(minY, 0)
  }
};

const simulateFall = (rockMap, startY, startX, i) => {
  let consoling = -1;
  let y = startY;
  for(y; rockMap[y + 1][startX] === ' '; y++) {
    //rockMap[y][startX] = ' ';
  }

  if(rockMap[y + 1][startX - 1] === ' ') {
    if(rockMap[y + 2][startX - 1] === ' ' || rockMap[y + 2][startX - 2] === ' ' || rockMap[y + 2][startX] === ' ') {
      if(i === consoling) {
        console.log('left roll');
      }
      simulateFall(rockMap, y, startX - 1, i);
    } else if(rockMap[y + 2][startX - 1] === undefined || rockMap[y + 2][startX - 2] === undefined) {
      //throw new Error('done');
    } else {
      rockMap[y + 1][startX - 1] = 'o';
    }
  } else if(rockMap[y + 1][startX + 1] === ' ') {
    if(rockMap[y + 2][startX + 1] === ' ' || rockMap[y + 2][startX + 2] === ' ' || rockMap[y + 2][startX] === ' ') {
      if(i === consoling) {
        console.log('right roll');
      }
      simulateFall(rockMap, y, startX + 1, i);
    } else if(rockMap[y + 2][startX + 1] === undefined || rockMap[y + 2][startX + 2] === undefined) {
      //throw new Error('done');
    } else {
      rockMap[y + 1][startX + 1] = 'o';
    }
  } else {
    if(rockMap[y][startX] === '+')
    {
      throw new Error();
    }
    rockMap[y][startX] = 'o';
  }
}


const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  input.rockMap[0 - input.minY][500 - input.minX] = '+';
  let i = 0;
  try {
    for(i = 0; i < 2000; i++) {
      simulateFall(input.rockMap, 0 - input.minY, 500 - input.minX, i);
    }
  } catch {

  }

  return input.rockMap.flat().filter(item => item === 'o').length;
};

const part2 = (rawInput: string) => {
  const extended = 1000;
  const input = parseInput(rawInput);
  const extendedRockMap = input.rockMap.map(row => [...initializeArrayWithValues(extended, ' '), ...row, ...initializeArrayWithValues(extended, ' ')])
  extendedRockMap.push([...initializeArrayWithValues(extendedRockMap[0].length, '#')]);
  extendedRockMap[0 - input.minY][500 - input.minX + extended] = '+';
  
  let i = 0;

  try {
    for(i = 0; i < 30000; i++) {
      simulateFall(extendedRockMap, 0 - input.minY, 500 - input.minX + extended, i);
    }
  } catch {

  }

  return extendedRockMap.flat().filter(item => ['o', '+'].includes(item as string)).length;
};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
