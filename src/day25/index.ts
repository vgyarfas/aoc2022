import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const inputBaseTenSum = input.map(row => {
    return row.reverse().map((digit, index) => {
      const multiple = Math.pow(5, index);
      let realDigit;
      switch(digit) {
        case '=': realDigit = -2; break;
        case '-': realDigit = -1; break;
        default: realDigit = +digit; break;
      }
      return multiple * realDigit;
    }).reduce((a, c) => a + c, 0);
  }).reduce((a, c) => a + c, 0);

  console.log(inputBaseTenSum);

  let num = inputBaseTenSum;
  let i = 0;
  const digits = [];
  while(num !== 0) {
    if(num % Math.pow(5, i + 1) <= Math.floor((Math.pow(5, i + 1) / 2))) {
      const represent = (num % Math.pow(5, i + 1)) / (Math.pow(5, i));
      digits.push(represent);
      num -= represent * Math.pow(5, i);
    } else { //if(num % Math.pow(5, i + 1) > Math.floor((Math.pow(5, i + 1) / 2))) {
      const represent = (num % Math.pow(5, i + 1)) / (Math.pow(5, i));
      digits.push(represent - 5);
      num -= (represent - 5) * Math.pow(5, i);
    }
    i++;
  }
  console.log(digits);

  // digits.reverse().map(digit => {
  //   switch(digit) {
  //     case -2: return '=';
  //     case -1: return '-';
  //     default: return digit.toString();
  //   }
  // }).join('');

  return digits.reverse().map(digit => {
    switch(digit) {
      case -2: return '=';
      case -1: return '-';
      default: return digit.toString();
    }
  }).join('');
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        1=-0-2
        12111
        2=0=
        21
        2=01
        111
        20012
        112
        1=-1=
        1-12
        12
        1=
        122
        `,
        expected: "2=-1=0",
      },
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
