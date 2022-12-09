import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((row) => row.split(" "))
    .map((rowArray) => [rowArray[0], +rowArray[1]]);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let tailPositions = [];
  //            UD  LR
  let tailPos = [0, 0];
  let headPos = [0, 0];
  for (let row of input) {
    const [dir, amount] = row;
    for (let i = 0; i < amount; i++) {
      if (dir === "U") {
        headPos[0] += 1;
      } else if (dir === "D") {
        headPos[0] -= 1;
      } else if (dir === "R") {
        headPos[1] += 1;
      } else if (dir === "L") {
        headPos[1] -= 1;
      }

      const verticalDiff = Math.abs(headPos[0] - tailPos[0]);
      const headIsUpper = headPos[0] > tailPos[0];
      const horizontalDiff = Math.abs(headPos[1] - tailPos[1]);
      const headIsRighter = headPos[1] > tailPos[1];

      if (verticalDiff > 1 || horizontalDiff > 1) {
        if (verticalDiff === 2) {
          tailPos = [tailPos[0] + (headIsUpper ? 1 : -1), headPos[1]];
        } else if (horizontalDiff === 2) {
          tailPos = [headPos[0], tailPos[1] + (headIsRighter ? 1 : -1)];
        }
      }
      tailPositions.push(tailPos.join(","));
    }
  }

  return [...new Set(tailPositions)].length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let tailPositions = [];
  //            UD  LR
  let tailPos = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  let headPos = [0, 0];
  for (let row of input) {
    const [dir, amount] = row;
    for (let i = 0; i < amount; i++) {
      if (dir === "U") {
        headPos[0] += 1;
      } else if (dir === "D") {
        headPos[0] -= 1;
      } else if (dir === "R") {
        headPos[1] += 1;
      } else if (dir === "L") {
        headPos[1] -= 1;
      }

      const verticalDiff = Math.abs(headPos[0] - tailPos[0][0]);
      const headIsUpper = headPos[0] > tailPos[0][0];
      const horizontalDiff = Math.abs(headPos[1] - tailPos[0][1]);
      const headIsRighter = headPos[1] > tailPos[0][1];

      if (verticalDiff > 1 || horizontalDiff > 1) {
        if (verticalDiff === 2) {
          tailPos[0] = [tailPos[0][0] + (headIsUpper ? 1 : -1), headPos[1]];
        } else if (horizontalDiff === 2) {
          tailPos[0] = [headPos[0], tailPos[0][1] + (headIsRighter ? 1 : -1)];
        }
      }

      for(let t = 1; t < tailPos.length; t++) {

        const verticalDiff = Math.abs(tailPos[t-1][0] - tailPos[t][0]);
        const headIsUpper = tailPos[t-1][0] > tailPos[t][0];
        const horizontalDiff = Math.abs(tailPos[t-1][1] - tailPos[t][1]);
        const headIsRighter = tailPos[t-1][1] > tailPos[t][1];

        if (verticalDiff > 1 || horizontalDiff > 1) {
          if(verticalDiff === 2 && horizontalDiff === 2) {
            tailPos[t] = [tailPos[t][0] + (headIsUpper ? 1 : -1), tailPos[t][1] + (headIsRighter ? 1 : -1)];
          } else if (verticalDiff === 2) {
            tailPos[t] = [tailPos[t][0] + (headIsUpper ? 1 : -1), tailPos[t-1][1]];
          } else if (horizontalDiff === 2) {
            tailPos[t] = [tailPos[t-1][0], tailPos[t][1] + (headIsRighter ? 1 : -1)];
          }
        }
      }
      tailPositions.push(tailPos[8].join(","));
      //console.log(tailPos);
    }
  }

  return [...new Set(tailPositions)].length;
};

run({
  part1: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 1,
      },
      {
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
