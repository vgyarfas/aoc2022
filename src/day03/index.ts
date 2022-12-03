import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(`\n`).map(row => row.trim().split(''))

const getIntersection = <T,_>(a: T[], ...arr: T[][]): T[] => [...new Set(a)].filter((v) => arr.every((b) => b.includes(v)));
const chunk = <T,>(arr: T[], size: number): T[][] => (
  arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [] as T[][])
);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const halfInput = input.map(row => [row.slice(0, row.length / 2), row.slice(row.length / 2)]);
  const sameLetters = halfInput.map(row => getIntersection(row[0], row[1])).flat();
  const values = sameLetters.map(letter => {
    const charCode = letter.charCodeAt(0);
    if(charCode > 64 && charCode < 91) {
      //uppercase
      return charCode - 38;
    } else {
      //lowercase
      return charCode - 96;
    }
  })

  return values.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const trios = chunk(input, 3);
  const sameLetters = trios.map(trio => getIntersection(trio[0], trio[1], trio[2])).flat();
  const values = sameLetters.map(letter => {
    const charCode = letter.charCodeAt(0);
    if(charCode > 64 && charCode < 91) {
      //uppercase
      return charCode - 38;
    } else {
      //lowercase
      return charCode - 96;
    }
  })

  return values.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
