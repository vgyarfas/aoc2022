import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.split(' ').map((item, index) => index === 0 ? item : +item));

export const lettersOCR = {
  ' ## \n#  #\n#  #\n####\n#  #\n#  #': 'A',            // fixed
  '#   #\n#   #\n#   #\n#   #\n#   #\n#####': 'B',
  ' ## \n#  #\n#   \n#   \n#  #\n ## ': 'C',            // fixed
  '###\n#  #\n#   #\n#   #\n#  #\n####': 'D',
  '####\n#   \n### \n#   \n#   \n####': 'E',            // fixed
  '####\n#   \n### \n#   \n#   \n#   ': 'F',            // fixed
  '###\n#   #\n#   #\n#   #\n#  #\n###': 'G',
  '#   #\n#   #\n####\n#   #\n#   #\n#   #': 'H',
  '###\n  #\n  #\n  #\n  #\n###': 'I',
  '  ##\n   #\n   #\n   #\n#  #\n ## ': 'J',            // fixed
  '#   #\n#  #\n###\n#  #\n#   #\n#   #': 'K',
  '#   #\n#   #\n#   #\n#   #\n#   #\n####': 'L',
  '#   #\n###\n###\n#   #\n#   #\n#   #': 'M',
  '#   #\n###\n###\n# #\n# #\n# #': 'N',
  '###\n#   #\n#   #\n#   #\n#   #\n###': 'O',
  '### \n#  #\n#  #\n### \n#   \n#   ': 'P',            // fixed
  '###\n#   #\n#   #\n#   #\n#  #\n####': 'Q',
  '### \n#  #\n#  #\n### \n# # \n#  #': 'R',            // fixed
  '####\n#   #\n####\n  #\n  #\n####': 'S',
  '####\n  #\n  #\n  #\n  #\n  #': 'T',
  '#   #\n#   #\n#   #\n#   #\n#   #\n###': 'U',
  '#   #\n#   #\n#   #\n#   #\n # #\n  #': 'V',
  '#   #\n#   #\n# #\n###\n# #\n#   #': 'W',
  '#   #\n # #\n  #\n  #\n # #\n#   #': 'X',
  '#   #\n # #\n  #\n  #\n  #\n  #': 'Y',
  '####\n  #\n  #\n #\n #\n####': 'Z'
}


const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sigStrengths = [];
  let cycle = 0;
  let value = 1;
  const checkCycle = (cycle, value) => {
    if((cycle + 20) % 40 === 0) {
      sigStrengths.push(cycle * value);
    }
  }

  for(let row of input) {
    cycle++;
    checkCycle(cycle, value);
    if(row[0] === 'addx') {
      cycle++;
      checkCycle(cycle, value);
    }
    if(row[0] === 'addx') {
      value += row[1] as number;
    }
  }

  return sigStrengths.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pictures = [[], [], [], [], [], []];
  let cycle = 0;
  let value = 1;
  const drawCycle = (cycle, value) => {
    const picIndex = Math.floor((cycle - 1) / 40);
    pictures[picIndex].push(Math.abs(((cycle - 1) % 40) - value) < 2 ? "#" : " ");
  }

  for(let row of input) {
    cycle++;
    drawCycle(cycle, value);
    if(row[0] === 'addx') {
      cycle++;
      drawCycle(cycle, value);
    }
    if(row[0] === 'addx') {
      value += row[1] as number;
    }
  }

  const asciiArt = pictures.map(row => row.join(''));
  const letterChunks = asciiArt.map(row => row.match(/.{1,5}/g).map(item => item.slice(0, 4)));
  const letters = []
  for(let i = 0; i < letterChunks[0].length; i++) {
    letters.push(letterChunks.map(chunk => chunk[i]).join("\n"));
  }

  const result = letters.map(lett => lettersOCR[lett]).join('');

  //console.log(letters.map(lett => lettersOCR[lett]));

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop`,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
