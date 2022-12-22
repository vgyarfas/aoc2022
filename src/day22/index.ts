import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const twoParts = rawInput.split("\n\n");
  const instructions = twoParts[1]
    .split(/(\d+|[A-Za-z])/g)
    .filter(Boolean)
    .map((item, index) => (index % 2 === 0 ? +item : item));
  const maps = twoParts[0].split("\n").map((row) => row.split(""));
  return { maps, instructions };
};

enum Rotation {
  Right = "R",
  Left = "L",
  Up = "U",
  Down = "D",
}

const rotArray = [Rotation.Right, Rotation.Down, Rotation.Left, Rotation.Up];

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const character = {
    row: 0,
    column: input.maps[0].findIndex((item) => item === "." || item === "#"),
    rotIndex: 0,
  };
  input.instructions.forEach((inst, index) => {
    //console.log('next inst: ' + inst);
    //movement
    if (index % 2 === 0) {
      switch (rotArray[character.rotIndex]) {
        case Rotation.Right:
          for (let i = 0; i < inst; i++) {
            if (input.maps[character.row][character.column + 1] === ".") {
              character.column += 1;
            } else if (
              input.maps[character.row][character.column + 1] === "#"
            ) {
              //do nothing
            } else {
              const firstOfRowIndex = input.maps[character.row].findIndex(
                (item) => item === "." || item === "#",
              );
              const firstOfRow = input.maps[character.row].find(
                (item) => item === "." || item === "#",
              );
              if (firstOfRow === ".") {
                character.column = firstOfRowIndex;
              } else {
                //do nothing
              }
            }
          }
          break;
        case Rotation.Left:
          for (let i = 0; i < inst; i++) {
            if (input.maps[character.row][character.column - 1] === ".") {
              character.column -= 1;
            } else if (
              input.maps[character.row][character.column - 1] === "#"
            ) {
              //do nothing
            } else {
              const firstOfRowIndex = input.maps[character.row].findLastIndex(
                (item) => item === "." || item === "#",
              );
              const firstOfRow = input.maps[character.row].findLast(
                (item) => item === "." || item === "#",
              );
              if (firstOfRow === ".") {
                character.column = firstOfRowIndex;
              } else {
                //do nothing
              }
            }
          }
          break;
        case Rotation.Up:
          for (let i = 0; i < inst; i++) {
            if (
              character.row > 0 &&
              input.maps[character.row - 1][character.column] === "."
            ) {
              character.row -= 1;
            } else if (
              character.row > 0 &&
              input.maps[character.row - 1][character.column] === "#"
            ) {
              //do nothing
            } else {
              const firstRowIndex = input.maps.findLastIndex(
                (row) =>
                  row[character.column] !== undefined &&
                  row[character.column] !== " ",
              );
              const firstRow = input.maps.findLast(
                (row) =>
                  row[character.column] !== undefined &&
                  row[character.column] !== " ",
              )[character.column];
              if (firstRow === ".") {
                character.row = firstRowIndex;
              } else {
                //do nothing
              }
            }
          }
          break;
        case Rotation.Down:
          for (let i = 0; i < inst; i++) {
            if (
              character.row < input.maps.length - 1 &&
              input.maps[character.row + 1][character.column] === "."
            ) {
              character.row += 1;
            } else if (
              character.row < input.maps.length - 1 &&
              input.maps[character.row + 1][character.column] === "#"
            ) {
              //do nothing
            } else {
              const firstRowIndex = input.maps.findIndex(
                (row) =>
                  row[character.column] !== undefined &&
                  row[character.column] !== " ",
              );
              const firstRow = input.maps.find(
                (row) =>
                  row[character.column] !== undefined &&
                  row[character.column] !== " ",
              )[character.column];
              if (firstRow === ".") {
                character.row = firstRowIndex;
              } else {
                //do nothing
              }
            }
          }
          break;
      }
    }
    // rotation
    else {
      if (inst === "R") {
        character.rotIndex = (character.rotIndex + 1) % 4;
      } else {
        character.rotIndex = (character.rotIndex + 3) % 4;
      }
    }
    //console.log(`character position now: ${character.row + 1} ${character.column + 1} ${rotArray[character.rotIndex]}`);
  });
  return (
    1000 * (character.row + 1) + 4 * (character.column + 1) + character.rotIndex
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const character = {
    row: 0,
    column: input.maps[0].findIndex((item) => item === "." || item === "#"),
    rotIndex: 0,
  };
  input.instructions.forEach((inst, index) => {
    //console.log('next inst: ' + inst);
    //movement
    if (index % 2 === 0) {
      for (let i = 0; i < inst; i++) {
        switch (rotArray[character.rotIndex]) {
          case Rotation.Right:
            if (input.maps[character.row][character.column + 1] === ".") {
              character.column += 1;
            } else if (
              input.maps[character.row][character.column + 1] === "#"
            ) {
              //do nothing
            } else {
              if(character.row < 50) {
                const offset = 49 - character.row;
                const rowToContinue = 100 + offset;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 99`);
                if(input.maps[rowToContinue][99] === ".") {
                  character.row = rowToContinue;
                  character.column = 99;
                  character.rotIndex = 2;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                }
                console.log("---------")
              } else if(character.row < 100) {
                const columnToContinue = character.row + 50;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check column 49 ${columnToContinue}`);
                if(input.maps[49][columnToContinue] === ".") {
                  character.row = 49;
                  character.column = columnToContinue;
                  character.rotIndex = 3;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else if(character.row < 150) {
                const offset = 149 - character.row;
                const rowToContinue = offset;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 149`);
                if(input.maps[rowToContinue][149] === ".") {
                  character.row = rowToContinue;
                  character.column = 149;
                  character.rotIndex = 2;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else {
                const columnToContinue = character.row - 100;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check column 149 ${columnToContinue}`);
                if(input.maps[149][columnToContinue] === ".") {
                  character.row = 149;
                  character.column = columnToContinue;
                  character.rotIndex = 3;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              }
            }
            break;
          case Rotation.Left:
            if (input.maps[character.row][character.column - 1] === ".") {
              character.column -= 1;
            } else if (
              input.maps[character.row][character.column - 1] === "#"
            ) {
              //do nothing
            } else {
              if(character.row < 50) {
                const rowToContinue = 149 - character.row;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 0`);
                if(input.maps[rowToContinue][0] === ".") {
                  character.row = rowToContinue;
                  character.column = 0;
                  character.rotIndex = 0;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else if(character.row < 100) {
                const columnToContinue = character.row - 50;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check column 100 ${columnToContinue}`);
                if(input.maps[100][columnToContinue] === '.') {
                  character.row = 100;
                  character.column = columnToContinue;
                  character.rotIndex = 1;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else if(character.row < 150) {
                const offset = character.row - 100;
                const rowToContinue = 49 - offset;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 50`);
                if(input.maps[rowToContinue][50] === ".") {
                  character.row = rowToContinue;
                  character.column = 50;
                  character.rotIndex = 0;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else {
                const offset = character.row - 150;
                const columnToContinue = 50 + offset;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check column 0 ${columnToContinue}`);
                if(input.maps[0][columnToContinue] === '.') {
                  character.row = 0;
                  character.column = columnToContinue;
                  character.rotIndex = 1;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              }
            }
            break;
          case Rotation.Up:
            if (
              character.row > 0 &&
              input.maps[character.row - 1][character.column] === "."
            ) {
              character.row -= 1;
            } else if (
              character.row > 0 &&
              input.maps[character.row - 1][character.column] === "#"
            ) {
              //do nothing
            } else {
              if(character.column < 50) {
                const rowToContinue = character.column + 50;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 50`);
                if(input.maps[rowToContinue][50] === '.') {
                  character.row = rowToContinue;
                  character.column = 50;
                  character.rotIndex = 0;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else if(character.column < 100) {
                const offset = character.column - 50;
                const rowToContinue = offset + 150;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 0`);
                if(input.maps[rowToContinue][0] === '.') {
                  character.row = rowToContinue;
                  character.column = 0;
                  character.rotIndex = 0;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else {
                const columnToContinue = character.column - 100;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check column 199 ${columnToContinue}`);
                if(input.maps[199][columnToContinue] === '.') {
                  character.row = 199;
                  character.column = columnToContinue;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              }
            }
            break;
          case Rotation.Down:
            if (
              character.row < input.maps.length - 1 &&
              input.maps[character.row + 1][character.column] === "."
            ) {
              character.row += 1;
            } else if (
              character.row < input.maps.length - 1 &&
              input.maps[character.row + 1][character.column] === "#"
            ) {
              //do nothing
            } else {
              if (character.column < 50) {
                const columnToContinue = character.column + 100;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check column 0 ${columnToContinue}`);
                if(input.maps[0][columnToContinue] === '.') {
                  character.column = columnToContinue;
                  character.row = 0;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else if (character.column < 100) {
                const offset = character.column - 50;
                const rowToContinue = 150 + offset;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 49`);
                if (input.maps[rowToContinue][49] === ".") {
                  character.rotIndex = 2;
                  character.row = rowToContinue;
                  character.column = 49;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              } else {
                const offset = character.column - 100;
                const rowToContinue = 50 + offset;
                console.log(`from: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                console.log(`check row ${rowToContinue} 99`);
                if (input.maps[rowToContinue][99] === ".") {
                  character.rotIndex = 2;
                  character.row = rowToContinue;
                  character.column = 99;
                  console.log(`to: ${character.row} ${character.column} ${rotArray[character.rotIndex]}`);
                  console.log("---------")
                }
                console.log("---------")
              }
            }
            break;
        }
      }
    }
    // rotation
    else {
      if (inst === "R") {
        character.rotIndex = (character.rotIndex + 1) % 4;
      } else {
        character.rotIndex = (character.rotIndex + 3) % 4;
      }
    }
    //console.log(`character position now: ${character.row + 1} ${character.column + 1} ${rotArray[character.rotIndex]}`);
  });
  return (
    1000 * (character.row + 1) + 4 * (character.column + 1) + character.rotIndex
  );
};

run({
  part1: {
    tests: [
      {
        input: `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
        expected: 6032,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //       {
      //         input: `        ...#
      //         .#..
      //         #...
      //         ....
      // ...#.......#
      // ........#...
      // ..#....#....
      // ..........#.
      //         ...#....
      //         .....#..
      //         .#......
      //         ......#.
      // 10R5L5R10L4R5L5`,
      //         expected: 5031,
      //       },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
