import run from "aocrunner";

const parseInput = (
  rawInput: string,
): {
  containers: Array<Array<string>>;
  orders: Array<{ moveNrOfUnits: number; fromIndex: number; toIndex: number }>;
} => {
  const rows = rawInput.split("\n");
  const splitIndex = rows
    .map((row) => row.trim())
    .findIndex((row) => row === "");
  const splitRows = rows
    .slice(0, splitIndex - 1)
    .map((row) => row.match(/.{1,4}/g).map((item) => item.substring(1, 2)));

  const containers = [];
  for (let i = 0; i < splitRows[0].length; i++) {
    containers.push(
      splitRows
        .map((row) => row[i])
        .reverse()
        .filter((item) => item !== " "),
    );
  }

  const orders = rows
    .slice(splitIndex + 1)
    .map((row) => row.split(" ").filter((item) => Number.isInteger(+item)))
    .map((item) => ({
      moveNrOfUnits: +item[0],
      fromIndex: +item[1] - 1,
      toIndex: +item[2] - 1,
    }));

  return { containers, orders };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let order of input.orders) {
    for (let i = 0; i < order.moveNrOfUnits; i++) {
      if (input.containers[order.fromIndex].length > 0) {
        input.containers[order.toIndex].push(
          input.containers[order.fromIndex].pop(),
        );
      }
    }
  }

  return input.containers
    .map((container) => container[container.length - 1])
    .join("");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let order of input.orders) {
    input.containers[order.toIndex].push(
      ...input.containers[order.fromIndex].splice(
        -order.moveNrOfUnits,
        order.moveNrOfUnits,
      ),
    );
  }

  return input.containers
    .map((container) => container[container.length - 1])
    .join("");
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
        
move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
        
move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
