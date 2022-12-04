import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(`\n`).map(row => row.trim().split(',').map(assignment => assignment.split('-').map(num => +num)));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let contains = 0;
  for(let row of input) {
    if((row[0][0] <= row[1][0] && row[0][1] >= row[1][1]) || (row[0][0] >= row[1][0] && row[0][1] <= row[1][1])) {
      contains++;
    }
  }
  return contains;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let contains = 0;
  for(let row of input) {
    if((row[0][0] <= row[1][0] && row[0][1] >= row[1][0]) || 
      (row[0][0] <= row[1][1] && row[0][1] >= row[1][1]) || 
      (row[1][0] <= row[0][0] && row[1][1] >= row[0][0]) || 
      (row[1][0] <= row[0][1] && row[1][1] >= row[0][1])) {
      contains++;
    }
  }
  return contains;

  return;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
