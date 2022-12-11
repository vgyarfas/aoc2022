import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const rows = rawInput.split('\n\n').map(statement => statement.split('\n'));
  return rows.map((row, index) => ({
    monkeyIndex: index,
    items: row[1].split(': ')[1].split(', ').map(item => +item),
    operation: Function('old', `return ${row[2].split('= ')[1]}`),
    divisibleBy: +row[3].split(' ')[row[3].split(' ').length - 1],
    trueThrowIndex: +row[4].split(' ')[row[4].split(' ').length - 1],
    falseThrowIndex: +row[5].split(' ')[row[5].split(' ').length - 1],
  }))
}

const parseInputForPart2 = (rawInput: string) => {
  const rows = rawInput.split('\n\n').map(statement => statement.split('\n'));
  return rows.map((row, index) => { 
    const functionStringPieces = row[2].split('= ')[1].split(' ');
    const functionString = `${functionStringPieces[0]} ${functionStringPieces[1]} BigInt(${functionStringPieces[2]})`;

    return ({
      monkeyIndex: index,
      items: row[1].split(': ')[1].split(', ').map(item => BigInt(item)),
      operation: Function('old', `return ${functionString}`),
      divisibleBy: BigInt(row[3].split(' ')[row[3].split(' ').length - 1]),
      trueThrowIndex: +row[4].split(' ')[row[4].split(' ').length - 1],
      falseThrowIndex: +row[5].split(' ')[row[5].split(' ').length - 1],
    })
  })
}

const releaseWorry = (item: number) => {
  return Math.floor(item / 3);
}

const initializeArrayWithValues = (n, val = 0) =>
  Array.from({ length: n }).fill(val);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const numberOfThrows = initializeArrayWithValues(input.length, 0) as number[];

  for(let i = 0; i < 20; i++) {
    for(let [index, monkey] of input.entries()) {
      for(let item of monkey.items) {
        monkey.items = monkey.items.slice(1);
        const newItem = releaseWorry(monkey.operation(item));
        numberOfThrows[index] += 1;
        if(newItem % monkey.divisibleBy === 0) {
          input[monkey.trueThrowIndex].items.push(newItem);
        } else {
          input[monkey.falseThrowIndex].items.push(newItem);
        }
      }
    }
  }

  const numberOfThrowsSorted = numberOfThrows.sort((a, b) => b - a);

  return numberOfThrowsSorted[0] * numberOfThrowsSorted[1];
};

const part2 = (rawInput: string) => {
  const input = parseInputForPart2(rawInput);
  const allDivisibles = input.map(monkey => monkey.divisibleBy).reduce((acc, curr) => acc * curr, 1n);

  const numberOfThrows = initializeArrayWithValues(input.length, 0) as number[];

  for(let i = 0; i < 10000; i++) {
    for(let monkey of input) {
      for(let item of monkey.items) {
        monkey.items = monkey.items.slice(1);
        const newItem = monkey.operation(item) % allDivisibles;
        numberOfThrows[monkey.monkeyIndex] += 1;
        if(newItem % monkey.divisibleBy === 0n) {
          input[monkey.trueThrowIndex].items.push(newItem);
        } else {
          input[monkey.falseThrowIndex].items.push(newItem);
        }
      }
    }
  }

  const numberOfThrowsSorted = numberOfThrows.sort((a, b) => b - a);

  return numberOfThrowsSorted[0] * numberOfThrowsSorted[1];
};

run({
  part1: {
    tests: [
      {
        input: `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
        `,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
        `,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
