import run from "aocrunner";
import pkg from "graphlib";
const { alg, Graph } = pkg;

enum Direction {
  Left = "left",
  Right = "right",
  Up = "up",
  Down = "down",
  Stay = "stay"
}

function gcd2(a, b) {
  // Greatest common divisor of 2 integers
  if(!b) return b===0 ? a : NaN;
  return gcd2(b, a%b);
}
function lcm2(a, b) {
  // Least common multiple of 2 integers
  return a*b / gcd2(a, b);
}

const parseInput = (rawInput: string) => {
  const maps = rawInput.split('\n').slice(1, -1).map(row => row.split('').slice(1, -1));
  const blizzards = maps.map((row, rowIndex) => row.map((col, colIndex) => {
    if(col === '<') {
      return {
        x: rowIndex,
        y: colIndex,
        direction: Direction.Left
      }
    }
    if(col === '>') {
      return {
        x: rowIndex,
        y: colIndex,
        direction: Direction.Right
      }
    }
    if(col === '^') {
      return {
        x: rowIndex,
        y: colIndex,
        direction: Direction.Up
      }
    }
    if(col === 'v') {
      return {
        x: rowIndex,
        y: colIndex,
        direction: Direction.Down
      }
    }
    return undefined;
  })).flat().filter(Boolean);

  return { blizzards, width: maps[0].length, height: maps.length };
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cycle = lcm2(input.width, input.height);
  const playerPos = {x: -1, y: 0};
  const cycleFreePositions = [];  
  const g = new Graph({ directed: true });

  for(let i = 0; i < cycle; i++) {
    const cycleFreePos = [];
    for(let row = 0; row < input.height; row++) {
      for(let col = 0; col < input.width; col++) {
        if(!input.blizzards.some(blizz => blizz.x === row && blizz.y === col)) {
          cycleFreePos.push({x: row, y: col, nextPos: []});
          g.setNode(`${i}|${row}|${col}`);
        }
      }
    }
    cycleFreePos.push({x: -1, y: 0, nextPos: [Direction.Stay, Direction.Down]});
    g.setNode(`${i}|start`);
    cycleFreePos.push({x: input.height, y: input.width - 1, nextPos: []});
    g.setNode(`${i}|finish`);
    for(let blizzard of input.blizzards) {
      if(blizzard.direction === Direction.Right) {
        blizzard.y = (blizzard.y + 1) % input.width;
      } else if(blizzard.direction === Direction.Left) {
        blizzard.y = (blizzard.y + (input.width - 1)) % input.width;
      } else if(blizzard.direction === Direction.Down) {
        blizzard.x = (blizzard.x + 1) % input.height;
      } else if(blizzard.direction === Direction.Up) {
        blizzard.x = (blizzard.x + (input.height - 1)) % input.height;
      }
    }
    cycleFreePositions.push(cycleFreePos);
  }

  cycleFreePositions.forEach((positions, index) => {
    let nextIndex = (index + 1) % (cycleFreePositions.length);
    const nextPositions = cycleFreePositions[nextIndex];
    for(let pos of positions.filter(p => p.x < input.height)) {
      if(nextPositions.some(np => np.x === pos.x - 1 && np.y === pos.y)) {
        pos.nextPos.push(Direction.Up)
        if(pos.x === 0 && pos.y === 0) {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|start`);
        } else {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x - 1}|${pos.y}`);
        }
      }
      if(nextPositions.some(np => np.x === pos.x + 1 && np.y === pos.y)) {
        pos.nextPos.push(Direction.Down)
        if(pos.x === input.height - 1 && pos.y === input.width - 1) {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|finish`);
        } else if(pos.x === -1) {
          g.setEdge(`${index}|start`,  `${nextIndex}|${pos.x + 1}|${pos.y}`);
        } else {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x + 1}|${pos.y}`);
        }
      }
      if(nextPositions.some(np => np.y === pos.y - 1 && np.x === pos.x)) {
        pos.nextPos.push(Direction.Left)
        g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x}|${pos.y - 1}`);
      }
      if(nextPositions.some(np => np.y === pos.y + 1 && np.x === pos.x)) {
        pos.nextPos.push(Direction.Right)
        g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x}|${pos.y + 1}`);
      }
      if(nextPositions.some(np => np.y === pos.y && np.x === pos.x)) {
        pos.nextPos.push(Direction.Stay)
        if(pos.x !== -1) {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x}|${pos.y}`);
        } else {
          g.setEdge(`${index}|start`, `${nextIndex}|start`);
        }
      }
    }
  })

  //console.log(cycleFreePositions.map(cycle => cycle.map(pos => JSON.stringify(pos))));

  const finishes = Object.entries(alg.dijkstra(g, "0|start")).filter(([node, distObj]) => node.includes('finish') && distObj.distance < Number.POSITIVE_INFINITY).map(([node, distObj]) => distObj.distance);

  return Math.min(...finishes);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cycle = lcm2(input.width, input.height);
  const playerPos = {x: -1, y: 0};
  const cycleFreePositions = [];  
  const g = new Graph({ directed: true });

  for(let i = 0; i < cycle; i++) {
    const cycleFreePos = [];
    for(let row = 0; row < input.height; row++) {
      for(let col = 0; col < input.width; col++) {
        if(!input.blizzards.some(blizz => blizz.x === row && blizz.y === col)) {
          cycleFreePos.push({x: row, y: col, nextPos: []});
          g.setNode(`${i}|${row}|${col}`);
        }
      }
    }
    cycleFreePos.push({x: -1, y: 0, nextPos: [Direction.Stay, Direction.Down]});
    g.setNode(`${i}|start`);
    cycleFreePos.push({x: input.height, y: input.width - 1, nextPos: []});
    g.setNode(`${i}|finish`);
    for(let blizzard of input.blizzards) {
      if(blizzard.direction === Direction.Right) {
        blizzard.y = (blizzard.y + 1) % input.width;
      } else if(blizzard.direction === Direction.Left) {
        blizzard.y = (blizzard.y + (input.width - 1)) % input.width;
      } else if(blizzard.direction === Direction.Down) {
        blizzard.x = (blizzard.x + 1) % input.height;
      } else if(blizzard.direction === Direction.Up) {
        blizzard.x = (blizzard.x + (input.height - 1)) % input.height;
      }
    }
    cycleFreePositions.push(cycleFreePos);
  }

  cycleFreePositions.forEach((positions, index) => {
    let nextIndex = (index + 1) % (cycleFreePositions.length);
    const nextPositions = cycleFreePositions[nextIndex];
    for(let pos of positions) {
      if(nextPositions.some(np => np.x === pos.x - 1 && np.y === pos.y)) {
        pos.nextPos.push(Direction.Up)
        if(pos.x === 0 && pos.y === 0) {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|start`);
        } else if(pos.x === input.height && pos.y === input.width - 1) {
          g.setEdge(`${index}|finish`, `${nextIndex}|${pos.x - 1}|${pos.y}`);
        } else {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x - 1}|${pos.y}`);
        }
      }
      if(nextPositions.some(np => np.x === pos.x + 1 && np.y === pos.y)) {
        pos.nextPos.push(Direction.Down)
        if(pos.x === input.height - 1 && pos.y === input.width - 1) {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|finish`);
        } else if(pos.x === -1) {
          g.setEdge(`${index}|start`,  `${nextIndex}|${pos.x + 1}|${pos.y}`);
        } else {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x + 1}|${pos.y}`);
        }
      }
      if(nextPositions.some(np => np.y === pos.y - 1 && np.x === pos.x)) {
        pos.nextPos.push(Direction.Left)
        g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x}|${pos.y - 1}`);
      }
      if(nextPositions.some(np => np.y === pos.y + 1 && np.x === pos.x)) {
        pos.nextPos.push(Direction.Right)
        g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x}|${pos.y + 1}`);
      }
      if(nextPositions.some(np => np.y === pos.y && np.x === pos.x)) {
        pos.nextPos.push(Direction.Stay)
        if(pos.x === -1) {
          g.setEdge(`${index}|start`, `${nextIndex}|start`);
        } else if(pos.x === input.height && pos.y === input.width - 1) {
          g.setEdge(`${index}|finish`, `${nextIndex}|finish`);
        } else {
          g.setEdge(`${index}|${pos.x}|${pos.y}`, `${nextIndex}|${pos.x}|${pos.y}`);
        }
      }
    }
  })

  //console.log(cycleFreePositions.map(cycle => cycle.map(pos => JSON.stringify(pos))));

  const finishes1 = Object.entries(alg.dijkstra(g, "0|start")).filter(([node, distObj]) => node.includes('finish') && distObj.distance < Number.POSITIVE_INFINITY);
  const minDistance1 = Math.min(...finishes1.map(([node, distObj]) => distObj.distance));
  const startNode2 = finishes1.find(([node, distObj]) => distObj.distance === minDistance1)[0];
  const finishes2 = Object.entries(alg.dijkstra(g, startNode2)).filter(([node, distObj]) => node.includes('start') && distObj.distance < Number.POSITIVE_INFINITY);
  const minDistance2 = Math.min(...finishes2.map(([node, distObj]) => distObj.distance));
  const startNode3 = finishes2.find(([node, distObj]) => distObj.distance === minDistance2)[0];
  const finishes3 = Object.entries(alg.dijkstra(g, startNode3)).filter(([node, distObj]) => node.includes('finish') && distObj.distance < Number.POSITIVE_INFINITY);
  const minDistance3 = Math.min(...finishes3.map(([node, distObj]) => distObj.distance));

  return minDistance1 + minDistance2 + minDistance3;
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   #.#####
      //   #.....#
      //   #>....#
      //   #.....#
      //   #...v.#
      //   #.....#
      //   #####.#
      //   `,
      //   expected: 10,
      // },
      {
        input: `
        #.######
        #>>.<^<#
        #.<..<<#
        #>v.><>#
        #<^v^^>#
        ######.#
        `,
        expected: 18
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        #.######
        #>>.<^<#
        #.<..<<#
        #>v.><>#
        #<^v^^>#
        ######.#
        `,
        expected: 54
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
