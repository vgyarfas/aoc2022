import run from "aocrunner";

enum Move {
  North = "north",
  South = "south",
  West = "west",
  East = "east",
  Stay = "stay",
}

interface Elf {
  elfCoord: {
    x: number;
    y: number;
  };
  moveSet: Array<Move>;
  nextMove: {
    move?: Move;
    x?: number;
    y?: number;
  };
}

const parseInput = (rawInput: string): Array<Elf> => {
  const maps = rawInput.split("\n").map((row) => row.split(""));
  const elves = maps
    .map((row, rowIndex) =>
      row.map((col, colIndex) => {
        if (col === ".") {
          return undefined;
        } else if (col === "#") {
          return {
            elfCoord: {
              x: rowIndex,
              y: colIndex,
            },
            moveSet: [Move.North, Move.South, Move.West, Move.East],
            nextMove: {
              move: undefined,
              x: undefined,
              y: undefined,
            },
          };
        }
      }),
    )
    .flat()
    .filter(Boolean);
  return elves;
};

const checkNextMove = (
  elf: Elf,
  otherElves: Array<Elf>,
): { x: number; y: number; move: Move } => {
  const otherElfCoords = otherElves.map((e) => e.elfCoord);
  if (
    otherElfCoords.filter(
      (e) =>
        e.x === elf.elfCoord.x - 1 &&
        [elf.elfCoord.y - 1, elf.elfCoord.y, elf.elfCoord.y + 1].includes(e.y),
    ).length === 0 &&
    otherElfCoords.filter(
      (e) =>
        e.x === elf.elfCoord.x + 1 &&
        [elf.elfCoord.y - 1, elf.elfCoord.y, elf.elfCoord.y + 1].includes(e.y),
    ).length === 0 &&
    otherElfCoords.filter(
      (e) =>
        e.y === elf.elfCoord.y - 1 &&
        [elf.elfCoord.x - 1, elf.elfCoord.x, elf.elfCoord.x + 1].includes(e.x),
    ).length === 0 &&
    otherElfCoords.filter(
      (e) =>
        e.y === elf.elfCoord.y + 1 &&
        [elf.elfCoord.x - 1, elf.elfCoord.x, elf.elfCoord.x + 1].includes(e.x),
    ).length === 0
  ) {
    return { move: Move.Stay, x: elf.elfCoord.x, y: elf.elfCoord.y };
  }
  for (let moveItem of elf.moveSet) {
    switch (moveItem) {
      case Move.North:
        if (
          otherElfCoords.filter(
            (e) =>
              e.x === elf.elfCoord.x - 1 &&
              [elf.elfCoord.y - 1, elf.elfCoord.y, elf.elfCoord.y + 1].includes(
                e.y,
              ),
          ).length === 0
        ) {
          return { move: Move.North, x: elf.elfCoord.x - 1, y: elf.elfCoord.y };
        }
        break;
      case Move.South:
        if (
          otherElfCoords.filter(
            (e) =>
              e.x === elf.elfCoord.x + 1 &&
              [elf.elfCoord.y - 1, elf.elfCoord.y, elf.elfCoord.y + 1].includes(
                e.y,
              ),
          ).length === 0
        ) {
          return { move: Move.South, x: elf.elfCoord.x + 1, y: elf.elfCoord.y };
        }
        break;
      case Move.West:
        if (
          otherElfCoords.filter(
            (e) =>
              e.y === elf.elfCoord.y - 1 &&
              [elf.elfCoord.x - 1, elf.elfCoord.x, elf.elfCoord.x + 1].includes(
                e.x,
              ),
          ).length === 0
        ) {
          return { move: Move.West, x: elf.elfCoord.x, y: elf.elfCoord.y - 1 };
        }
        break;
      case Move.East:
        if (
          otherElfCoords.filter(
            (e) =>
              e.y === elf.elfCoord.y + 1 &&
              [elf.elfCoord.x - 1, elf.elfCoord.x, elf.elfCoord.x + 1].includes(
                e.x,
              ),
          ).length === 0
        ) {
          return { move: Move.East, x: elf.elfCoord.x, y: elf.elfCoord.y + 1 };
        }
        break;
    }
  }
  return { move: Move.Stay, x: elf.elfCoord.x, y: elf.elfCoord.y };
};

const part1 = (rawInput: string) => {
  const elves = parseInput(rawInput);

  for(let i = 0; i < 10; i++) {
    elves.forEach((elf, index) => {
      const otherElves = elves.filter((e, i) => index !== i);
      elf.nextMove = checkNextMove(elf, otherElves);
    });
    const elvesNextMove = elves.map((e) => e.nextMove);

    if(elvesNextMove.map(nm => nm.move).every(nmm => nmm === Move.Stay)) {
      break;
    }
  
    elves.forEach((elf, index) => {
      if (
        elvesNextMove.filter(
          (nm) => nm.x === elf.nextMove.x && nm.y === elf.nextMove.y,
        ).length > 1
      ) {
        elf.nextMove.move = Move.Stay;
      }
    });
  
    elves.forEach((elf) => {
      elf.moveSet.push(elf.moveSet.shift());
      if(elf.nextMove.move !== Move.Stay) {
        elf.elfCoord.x = elf.nextMove.x;
        elf.elfCoord.y = elf.nextMove.y;
      }
    })
  }

  const xCoords = elves.map(elf => elf.elfCoord.x);
  const yCoords = elves.map(elf => elf.elfCoord.y);

  const maxArea = (Math.max(...xCoords) - Math.min(...xCoords) + 1) * (Math.max(...yCoords) - Math.min(...yCoords) + 1);

  return maxArea - elves.length;
};

const part2 = (rawInput: string) => {
  const elves = parseInput(rawInput);

  let i = 1;

  while(true) {
    elves.forEach((elf, index) => {
      const otherElves = elves.filter((e, i) => index !== i);
      elf.nextMove = checkNextMove(elf, otherElves);
    });
    const elvesNextMove = elves.map((e) => e.nextMove);

    if(elvesNextMove.map(nm => nm.move).every(nmm => nmm === Move.Stay)) {
      break;
    }
  
    elves.forEach((elf, index) => {
      if (
        elvesNextMove.filter(
          (nm) => nm.x === elf.nextMove.x && nm.y === elf.nextMove.y,
        ).length > 1
      ) {
        elf.nextMove.move = Move.Stay;
      }
    });
  
    elves.forEach((elf) => {
      elf.moveSet.push(elf.moveSet.shift());
      if(elf.nextMove.move !== Move.Stay) {
        elf.elfCoord.x = elf.nextMove.x;
        elf.elfCoord.y = elf.nextMove.y;
      }
    })

    i++;
  }

  return i;
};

run({
  part1: {
    tests: [
      {
        input: `
        .....
        ..##.
        ..#..
        .....
        ..##.
        .....
        `,
        expected: 25,
      },
      {
        input: `
        ....#..
        ..###.#
        #...#.#
        .#...##
        #.###..
        ##.#.##
        .#..#..
        `,
        expected: 110,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ....#..
        ..###.#
        #...#.#
        .#...##
        #.###..
        ##.#.##
        .#..#..
        `,
        expected: 20,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
