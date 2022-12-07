import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const commands = rawInput.split("$").slice(1).map(cmd => cmd.trim());
  const directorySizes = {};
  const cursor = [];
  for(let fullCommand of commands) {
    const [command, ...params] = fullCommand.split('\n')[0].split(' ');
      if(command === "cd") {
        if(params[0] === "..") {
          cursor.pop();
        } else {
          cursor.push(params[0]);
        }
      } else if (command === "ls") {
        const fileDirList = fullCommand.split('\n').slice(1).map(fileDir => fileDir.split(' '));
        for(let fileDir of fileDirList) {
          if(fileDir[0] === 'dir') {
            // do nothing
          } else {
            for(let i = 0; i < cursor.length; i++) {
              const nextDir = cursor.slice(0, i + 1).join("/");
              directorySizes[nextDir] = (directorySizes[nextDir] ?? 0) + (+fileDir[0]);
            }
          }
        }
      }
  }
  return directorySizes;
}

const part1 = (rawInput: string) => {
  const directorySizes = parseInput(rawInput);
  const sizes = Object.values(directorySizes).filter(item => item <= 100000).map(item => +item);

  return sizes.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const directorySizes = parseInput(rawInput);
  const sumOfSizes = directorySizes['/'];
  const sizes = Object.values(directorySizes).map(item => +item).filter(item => sumOfSizes - item <= 40000000).sort((a, b) => a - b);
  return sizes[0];
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
