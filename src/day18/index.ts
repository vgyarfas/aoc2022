import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(",").map((num) => +num));

const checkNrOfAdjacents = ([x, y, z]: number[], array): number => {
  return (
    array.filter(
      ([x2, y2, z2]) => y === y2 && z === z2 && Math.abs(x - x2) === 1,
    ).length +
    array.filter(
      ([x2, y2, z2]) => x === x2 && z === z2 && Math.abs(y - y2) === 1,
    ).length +
    array.filter(
      ([x2, y2, z2]) => x === x2 && y === y2 && Math.abs(z - z2) === 1,
    ).length
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const adjacentCount = input.map((row, index) => checkNrOfAdjacents(row, input.filter((r, i) => i !== index))).reduce((a, c) => a + c, 0);
  return input.length * 6 - adjacentCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let [min, max] = input.reduce(
    ([min, max], item) => [
      min.map((v, i) => (v < item[i] ? v : item[i])),
      max.map((v, i) => (v > item[i] ? v : item[i])),
    ],
    [
      Array(3).fill(100000),
      Array(3).fill(-100000),
    ]
  );

    min = min.map(v => v - 1);
    max = max.map(v => v + 1);

    const visited = new Set();
    const outside = new Set();
    const inside = new Set(input.map(v => v.join(',')));
    const queue = [min.join(',')];

    while(queue.length > 0) {
      const current = queue.shift();
      outside.add(current);
      const [x, y, z] = current.split(',').map(num => +num);

      if(x > min[0] && !visited.has([x - 1, y, z].join(','))) {
        visited.add([x - 1, y, z].join(','));
        if(!inside.has([x - 1, y, z].join(','))) {
          queue.push([x - 1, y, z].join(','));
        }
      }
      if(x < max[0] && !visited.has([x + 1, y, z].join(','))) {
        visited.add([x + 1, y, z].join(','));
        if(!inside.has([x + 1, y, z].join(','))) {
          queue.push([x + 1, y, z].join(','));
        }
      }
      if(y > min[1] && !visited.has([x, y - 1, z].join(','))) {
        visited.add([x, y - 1, z].join(','));
        if(!inside.has([x, y - 1, z].join(','))) {
          queue.push([x, y - 1, z].join(','));
        }
      }
      if(y < max[1] && !visited.has([x, y + 1, z].join(','))) {
        visited.add([x, y + 1, z].join(','));
        if(!inside.has([x, y + 1, z].join(','))) {
          queue.push([x, y + 1, z].join(','));
        }
      }
      if(z > min[2] && !visited.has([x, y, z - 1].join(','))) {
        visited.add([x, y, z - 1].join(','));
        if(!inside.has([x, y, z - 1].join(','))) {
          queue.push([x, y, z - 1].join(','));
        }
      }
      if(z < max[2] && !visited.has([x, y, z + 1].join(','))) {
        visited.add([x, y, z + 1].join(','));
        if(!inside.has([x, y, z + 1].join(','))) {
          queue.push([x, y, z + 1].join(','));
        }
      }
    }


    const adjacentCount = [...outside].map((row: string) => row.split(',').map(num => +num)).map(numRow => checkNrOfAdjacents(numRow, input)).filter(num => num !== 0);

  return adjacentCount.reduce((a, c) => a + c, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        2,2,2
        1,2,2
        3,2,2
        2,1,2
        2,3,2
        2,2,1
        2,2,3
        2,2,4
        2,2,6
        1,2,5
        3,2,5
        2,1,5
        2,3,5
        `,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2,2,2
        1,2,2
        3,2,2
        2,1,2
        2,3,2
        2,2,1
        2,2,3
        2,2,4
        2,2,6
        1,2,5
        3,2,5
        2,1,5
        2,3,5
        `,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
