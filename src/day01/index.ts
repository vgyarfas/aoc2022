import run from "aocrunner";

const parseInput = (rawInput: string): Array<Array<number>> => rawInput.split("\n\n").map(row => row.split("\n").map(num => +num));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const totalCalories = input.map(row => row.reduce((a, b) => a + b, 0));
  return Math.max(...totalCalories);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const totalCaloriesSorted = input.map(row => row.reduce((a, b) => a + b, 0)).sort((a, b) => b - a);
  return totalCaloriesSorted[0] + totalCaloriesSorted[1] + totalCaloriesSorted[2];
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
