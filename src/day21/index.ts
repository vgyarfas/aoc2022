import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split('\n').map(row => row.split(": ")).map(row => {
    return {
      name: row[0],
      value: row[1].split('').some(letter => ['+', '-', '*', '/'].includes(letter)) ? undefined : +row[1],
      math: row[1].split('').filter(letter => ['+', '-', '*', '/'].includes(letter))[0],
      needsValues: row[1].split('').some(letter => ['+', '-', '*', '/'].includes(letter)) ? [row[1].split(' ')[0], row[1].split(' ')[2]] : undefined
    }
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const hasValue = input.filter(row => row.value !== undefined).map(row => row.name);

  while(!hasValue.includes('root')) {
    const canHaveValuesNow = input.filter(row => !hasValue.includes(row.name) && row.needsValues.every(name => hasValue.includes(name)));
    canHaveValuesNow.forEach(row => {
      const firstPart = input.find(inp => inp.name === row.needsValues[0]).value;
      const secondPart = input.find(inp => inp.name === row.needsValues[1]).value;
      let value;
      switch(row.math) {
        case '+':
          value = firstPart + secondPart;
          break;
        case '-':
          value = firstPart - secondPart;
          break;
        case '*':
          value = firstPart * secondPart;
          break;
        case '/':
          value = firstPart / secondPart;
          break;
      }
      input[input.findIndex(inp => inp.name === row.name)].value = value;
      hasValue.push(row.name);
    })
  }

  return input[input.findIndex(inp => inp.name === 'root')].value;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const parsedInput = input.filter(row => !['root', 'humn'].includes(row.name));
  parsedInput.push({
    ...input.find(row => row.name === 'humn'),
    value: 'humn'
  })
  const finalValues = input.find(row => row.name === 'root').needsValues;
  const hasValue = parsedInput.filter(row => row.value !== undefined).map(row => row.name);

  while(!hasValue.includes(finalValues[0]) || !hasValue.includes(finalValues[1])) {
    const canHaveValuesNow = parsedInput.filter(row => !hasValue.includes(row.name) && row.needsValues.every(name => hasValue.includes(name)));
    canHaveValuesNow.forEach(row => {
      const firstPart = parsedInput.find(inp => inp.name === row.needsValues[0]).value;
      const secondPart = parsedInput.find(inp => inp.name === row.needsValues[1]).value;
      let value;
      if(typeof firstPart === 'number' && typeof secondPart === 'number') {
        switch(row.math) {
          case '+':
            value = firstPart + secondPart;
            break;
          case '-':
            value = firstPart - secondPart;
            break;
          case '*':
            value = firstPart * secondPart;
            break;
          case '/':
            value = firstPart / secondPart;
            break;
        }
      } else {
        if(typeof firstPart === 'number') {
          value = firstPart
        } else {
          value = `(${firstPart})`;
        }
        value += ` ${row.math} `;
        if(typeof secondPart === 'number') {
          value += secondPart
        } else {
          value += `(${secondPart})`;
        }
      }
      parsedInput[parsedInput.findIndex(inp => inp.name === row.name)].value = value;
      hasValue.push(row.name);
    })
  }

  const leftPart = parsedInput[parsedInput.findIndex(inp => inp.name === finalValues[0])].value;
  const rightPart = parsedInput[parsedInput.findIndex(inp => inp.name === finalValues[1])].value
  console.log(parsedInput[parsedInput.findIndex(inp => inp.name === finalValues[0])].value);
  console.log(parsedInput[parsedInput.findIndex(inp => inp.name === finalValues[1])].value);

  let start = 0;
  let end = 100000000000000;
  let humn = Math.floor((start + end) / 2);

  while(true) {
    if(eval(leftPart) === rightPart) {
      return humn;
    }
    else if(eval(leftPart) < rightPart) {
      end = humn;
      humn = Math.floor((start + end) / 2);
    } else {
      start = humn;
      humn = Math.floor((start + end) / 2);
    }
  }

  //return;
};

run({
  part1: {
    tests: [
      {
        input: `
        root: pppw + sjmn
        dbpl: 5
        cczh: sllz + lgvd
        zczc: 2
        ptdq: humn - dvpt
        dvpt: 3
        lfqf: 4
        humn: 5
        ljgn: 2
        sjmn: drzm * dbpl
        sllz: 4
        pppw: cczh / lfqf
        lgvd: ljgn * ptdq
        drzm: hmdt - zczc
        hmdt: 32
        `,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `
      //   root: pppw + sjmn
      //   dbpl: 5
      //   cczh: sllz + lgvd
      //   zczc: 2
      //   ptdq: humn - dvpt
      //   dvpt: 3
      //   lfqf: 4
      //   humn: 5
      //   ljgn: 2
      //   sjmn: drzm * dbpl
      //   sllz: 4
      //   pppw: cczh / lfqf
      //   lgvd: ljgn * ptdq
      //   drzm: hmdt - zczc
      //   hmdt: 32
      //   `,
      //   expected: 301,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
