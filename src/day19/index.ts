import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const rows = rawInput.split("\n");
  return rows.map((row) => {
    const matches = row.match(
      /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/,
    );
    return {
      blueprint: +matches[1],
      oreRobotOreCost: +matches[2],
      clayRobotOreCost: +matches[3],
      obsidianRobotOreCost: +matches[4],
      obsidianRobotClayCost: +matches[5],
      geodeRobotOreCost: +matches[6],
      geodeRobotObsidianCost: +matches[7],
    };
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const data = {
    time: 0,
    robot: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    mineral: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
  };

  const result = [];

  for (let x = 0; x < input.length; x++) {
    const rules = input[x];
    const timeToRun = 24;
    const interimResult = [];

    const visited = new Set();
    let queue = [
      `${data.time},${Object.values(data.robot).join(",")},${Object.values(
        data.mineral,
      ).join(",")}`,
    ];
    for (let i = 0; i <= timeToRun; i++) {
      const iterationQueue = queue
        .filter((item) => +item.split(",")[0] === i)
        .sort((aItem, bItem) => {
          const [
            atime,
            aoreRobot,
            aclayRobot,
            aobsidianRobot,
            ageodeRobot,
            aore,
            aclay,
            aobsidian,
            ageode,
          ] = aItem.split(",").map((num) => +num);
          const [
            btime,
            boreRobot,
            bclayRobot,
            bobsidianRobot,
            bgeodeRobot,
            bore,
            bclay,
            bobsidian,
            bgeode,
          ] = bItem.split(",").map((num) => +num);

          return (
            bgeode * 100000 +
            (bobsidian + bgeodeRobot * rules.geodeRobotObsidianCost) * 1000 +
            (bclay + bobsidianRobot * rules.obsidianRobotClayCost) * 50 +
            (bore + bclayRobot * rules.clayRobotOreCost) -
            (ageode * 100000 +
              (aobsidian + ageodeRobot * rules.geodeRobotObsidianCost) * 1000 +
              (aclay + aobsidianRobot * rules.obsidianRobotClayCost) * 50 +
              (aore + aclayRobot * rules.clayRobotOreCost))
          );
        })
        .slice(0, 10000);

      while (iterationQueue.length > 0) {
        const [
          time,
          oreRobot,
          clayRobot,
          obsidianRobot,
          geodeRobot,
          ore,
          clay,
          obsidian,
          geode,
        ] = iterationQueue
          .shift()
          .split(",")
          .map((num) => +num);
        if (time < timeToRun) {
          if (
            ore >= rules.geodeRobotOreCost &&
            obsidian >= rules.geodeRobotObsidianCost
          ) {
            const nextState = [
              time + 1,
              oreRobot,
              clayRobot,
              obsidianRobot,
              geodeRobot + 1,
              ore - rules.geodeRobotOreCost + oreRobot,
              clay + clayRobot,
              obsidian - rules.geodeRobotObsidianCost + obsidianRobot,
              geode + geodeRobot,
            ].join(",");
            if (!visited.has(nextState)) {
              visited.add(nextState);
              if (!queue.includes(nextState)) {
                queue.push(nextState);
              }
            }
          } else {
            if (
              ore >= rules.obsidianRobotOreCost &&
              clay >= rules.obsidianRobotClayCost &&
              obsidianRobot < rules.geodeRobotObsidianCost
            ) {
              const nextState = [
                time + 1,
                oreRobot,
                clayRobot,
                obsidianRobot + 1,
                geodeRobot,
                ore - rules.obsidianRobotOreCost + oreRobot,
                clay - rules.obsidianRobotClayCost + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }

            if (
              ore >= rules.clayRobotOreCost &&
              clayRobot < rules.obsidianRobotClayCost
            ) {
              const nextState = [
                time + 1,
                oreRobot,
                clayRobot + 1,
                obsidianRobot,
                geodeRobot,
                ore - rules.clayRobotOreCost + oreRobot,
                clay + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }

            if (
              ore >= rules.oreRobotOreCost &&
              oreRobot <
                Math.max(
                  rules.clayRobotOreCost,
                  rules.geodeRobotOreCost,
                  rules.obsidianRobotOreCost,
                  rules.oreRobotOreCost,
                )
            ) {
              const nextState = [
                time + 1,
                oreRobot + 1,
                clayRobot,
                obsidianRobot,
                geodeRobot,
                ore - rules.oreRobotOreCost + oreRobot,
                clay + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }

            if (obsidian < rules.geodeRobotObsidianCost) {
              const nextState = [
                time + 1,
                oreRobot,
                clayRobot,
                obsidianRobot,
                geodeRobot,
                ore + oreRobot,
                clay + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }
          }
        }
        if (time === timeToRun && geode > 0) {
          interimResult.push(geode);
        }
      }

      queue = queue.filter((item) => +item.split(",")[0] === i + 1);
    }
    console.log(`rules ${x}: ${Math.max(...interimResult, 0)}`);
    result.push(Math.max(...interimResult, 0));
  }

  return result
    .map((item, index) => Math.max(item * (index + 1)), 0)
    .reduce((a, c) => a + c, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const data = {
    time: 0,
    robot: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    mineral: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
  };

  const result = [];

  for (let x = 0; x < 3; x++) {
    const rules = input[x];
    const timeToRun = 32; 
    const interimResult = [];

    const visited = new Set();
    let queue = [
      `${data.time},${Object.values(data.robot).join(",")},${Object.values(
        data.mineral,
      ).join(",")}`,
    ];
    for (let i = 0; i <= timeToRun; i++) {
      const iterationQueue = queue
        .filter((item) => +item.split(",")[0] === i)
        .sort((aItem, bItem) => {
          const [
            atime,
            aoreRobot,
            aclayRobot,
            aobsidianRobot,
            ageodeRobot,
            aore,
            aclay,
            aobsidian,
            ageode,
          ] = aItem.split(",").map((num) => +num);
          const [
            btime,
            boreRobot,
            bclayRobot,
            bobsidianRobot,
            bgeodeRobot,
            bore,
            bclay,
            bobsidian,
            bgeode,
          ] = bItem.split(",").map((num) => +num);

          return (
            bgeode * 100000 +
            (bobsidian + bgeodeRobot * rules.geodeRobotObsidianCost) * 1000 +
            (bclay + bobsidianRobot * rules.obsidianRobotClayCost) * 50 +
            (bore + bclayRobot * rules.clayRobotOreCost) -
            (ageode * 100000 +
              (aobsidian + ageodeRobot * rules.geodeRobotObsidianCost) * 1000 +
              (aclay + aobsidianRobot * rules.obsidianRobotClayCost) * 50 +
              (aore + aclayRobot * rules.clayRobotOreCost))
          );
        })
        .slice(0, 10000);

      while (iterationQueue.length > 0) {
        const [
          time,
          oreRobot,
          clayRobot,
          obsidianRobot,
          geodeRobot,
          ore,
          clay,
          obsidian,
          geode,
        ] = iterationQueue
          .shift()
          .split(",")
          .map((num) => +num);
        if (time < timeToRun) {
          if (
            ore >= rules.geodeRobotOreCost &&
            obsidian >= rules.geodeRobotObsidianCost
          ) {
            const nextState = [
              time + 1,
              oreRobot,
              clayRobot,
              obsidianRobot,
              geodeRobot + 1,
              ore - rules.geodeRobotOreCost + oreRobot,
              clay + clayRobot,
              obsidian - rules.geodeRobotObsidianCost + obsidianRobot,
              geode + geodeRobot,
            ].join(",");
            if (!visited.has(nextState)) {
              visited.add(nextState);
              if (!queue.includes(nextState)) {
                queue.push(nextState);
              }
            }
          } else {
            if (
              ore >= rules.obsidianRobotOreCost &&
              clay >= rules.obsidianRobotClayCost &&
              obsidianRobot < rules.geodeRobotObsidianCost
            ) {
              const nextState = [
                time + 1,
                oreRobot,
                clayRobot,
                obsidianRobot + 1,
                geodeRobot,
                ore - rules.obsidianRobotOreCost + oreRobot,
                clay - rules.obsidianRobotClayCost + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }

            if (
              ore >= rules.clayRobotOreCost &&
              clayRobot < rules.obsidianRobotClayCost
            ) {
              const nextState = [
                time + 1,
                oreRobot,
                clayRobot + 1,
                obsidianRobot,
                geodeRobot,
                ore - rules.clayRobotOreCost + oreRobot,
                clay + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }

            if (
              ore >= rules.oreRobotOreCost &&
              oreRobot <
                Math.max(
                  rules.clayRobotOreCost,
                  rules.geodeRobotOreCost,
                  rules.obsidianRobotOreCost,
                  rules.oreRobotOreCost,
                )
            ) {
              const nextState = [
                time + 1,
                oreRobot + 1,
                clayRobot,
                obsidianRobot,
                geodeRobot,
                ore - rules.oreRobotOreCost + oreRobot,
                clay + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }

            if (obsidian < rules.geodeRobotObsidianCost) {
              const nextState = [
                time + 1,
                oreRobot,
                clayRobot,
                obsidianRobot,
                geodeRobot,
                ore + oreRobot,
                clay + clayRobot,
                obsidian + obsidianRobot,
                geode + geodeRobot,
              ].join(",");
              if (!visited.has(nextState)) {
                visited.add(nextState);
                if (!queue.includes(nextState)) {
                  queue.push(nextState);
                }
              }
            }
          }
        }
        if (time === timeToRun && geode > 0) {
          interimResult.push(geode);
        }
      }

      queue = queue.filter((item) => +item.split(",")[0] === i + 1);
    }
    console.log(`rules ${x}: ${Math.max(...interimResult, 0)}`);
    result.push(Math.max(...interimResult, 0));
  }

  return result.reduce((a, c) => a * c, 1);
};

run({
  part1: {
    tests: [
      // {
      //   input: `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 18 clay. Each geode robot costs 4 ore and 9 obsidian.        
      //   `,
      //   expected: 0
      // },
      // {
      //   input: `
      //   Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
      //   Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
      //   `,
      //   expected: 33,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `
      //     Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
      //     Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
      //     `,
      //   expected: 56 * 62,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
