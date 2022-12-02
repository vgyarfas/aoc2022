import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const winningHands = ["A Y", "B Z", "C X"];
  const drawHands = ["A X", "B Y", "C Z"];

  const scores = input.map(row => {
    let score = 0;
    switch(row[row.length - 1]) {
      case 'X':
        score += 1;
        break;
      case 'Y':
        score += 2;
        break;
      case 'Z':
        score += 3;
        break;
    }

    if(winningHands.includes(row)) {
      score += 6;
    }

    if(drawHands.includes(row)) {
      score += 3;
    }

    return score;
  });

  return scores.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const handScore = [
  // X  Y  Z
    [3, 1, 2], // A
    [1, 2, 3], // B
    [2, 3, 1]  // C
  ];

  const scores = input.map(row => {
    let score = 0;
    let firstIndex = 0;
    switch(row[0]) {
      case 'A':
        firstIndex = 0;
        break;
      case 'B':
        firstIndex = 1;
        break;
      case 'C':
        firstIndex = 2;
        break;
    }

    switch(row[row.length - 1]) {
      case 'X':
        score += handScore[firstIndex][0];
        break;
      case 'Y':
        score += handScore[firstIndex][1] + 3;
        break;
      case 'Z':
        score += handScore[firstIndex][2] + 6;
        break;
    }

    return score;
  });

  return scores.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `A Y\nB X\nC Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y\nB X\nC Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
