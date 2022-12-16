import run from "aocrunner";
import pkg from "graphlib";
const { alg, Graph } = pkg;

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((row) => {
    const firstSplit = row.split(" valve");
    const leadsToValves = firstSplit[1]
      .split(" ")
      .slice(1)
      .map((item, index, array) =>
        index !== array.length - 1 ? item.slice(0, -1) : item,
      );
    const secondSplit = firstSplit[0].split(";");
    const thirdSplit = secondSplit[0].split(" has flow rate=");
    const flowRate = +thirdSplit[1];
    const valve = thirdSplit[0].split(" ")[1];
    return { valve, flowRate, leadsToValves };
  });
};

function assign(obj, keyPath, value) {
  const lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

const getSubsets = (arr) =>
  arr.reduce(
    (prev, curr) => prev.concat(prev.map((k) => k.concat(curr))),
    [[]],
  );

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const maxTime = 30;

  const g = new Graph({ directed: true });
  input.forEach((item) => g.setNode(item.valve, { flowRate: item.flowRate }));
  input.forEach((item) =>
    item.leadsToValves.forEach((leadsTo) => g.setEdge(item.valve, leadsTo)),
  );

  const nonZeroFlowPointsWithIndex1 = input
    .filter((item) => item.valve === "AA" || item.flowRate !== 0)
    .map((item) => item.valve);
  const nonZeroFlowPoints = input
    .filter((item) => item.flowRate !== 0)
    .map((item) => item.valve);

  const distances = Object.entries(alg.floydWarshall(g))
    .filter((entry) => nonZeroFlowPointsWithIndex1.includes(entry[0]))
    .map((entry) => ({
      from: entry[0],
      to: Object.entries(entry[1])
        .filter(
          ([pointName, { distance, predecessor }]) =>
            pointName !== entry[0] && nonZeroFlowPoints.includes(pointName),
        )
        .map(([pointName, { distance, predecessor }]) => ({
          toPoint: pointName,
          distance,
        })),
    }));

  const dfs = (startPoint, visited, time) => {
    const returnVisited = [...visited, startPoint];
    const adjacents = distances
      .find((node) => node.from === startPoint)
      .to.filter((item) => !returnVisited.includes(item.toPoint))
      .filter((item) => item.distance + time < maxTime);

    const maxChild = Math.max(
      ...adjacents.map((adjacent) =>
        dfs(adjacent.toPoint, returnVisited, time + adjacent.distance + 1),
      ),
      0,
    );
    return (
      maxChild +
      (maxTime - time) * input.find((row) => row.valve === startPoint).flowRate
    );
  };

  const result = dfs("AA", [], 0);

  return result;
};

function permute(ns, subs) {
  if (ns.length != subs.reduce((a, b) => a + b))
    throw new Error("Subset cardinality mismatch");

  function g(i, _subs) {
    if (i == ns.length) return [_subs];

    let res = [];
    const cardinalities = new Set();

    function h(j) {
      let temp = _subs.map((x) => x.slice());
      temp[j].push(ns[i]);
      res = res.concat(g(i + 1, temp));
    }

    for (let j = 0; j < subs.length; j++) {
      if (!_subs[j].length && !cardinalities.has(subs[j])) {
        h(j);
        cardinalities.add(subs[j]);
      } else if (_subs[j].length && _subs[j].length < subs[j]) {
        h(j);
      }
    }
    return res;
  }
  let _subs = [];
  subs.map((_) => _subs.push([]));

  return g(0, _subs);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const maxTime = 26;

  const g = new Graph({ directed: true });
  input.forEach((item) => g.setNode(item.valve, { flowRate: item.flowRate }));
  input.forEach((item) =>
    item.leadsToValves.forEach((leadsTo) => g.setEdge(item.valve, leadsTo)),
  );

  const nonZeroFlowPoints = input
    .filter((item) => item.flowRate !== 0)
    .map((item) => item.valve);

  const splitPoints = permute(nonZeroFlowPoints, [
    nonZeroFlowPoints.length / 2,
    nonZeroFlowPoints.length / 2,
  ]).map(row => [row[0].concat('AA'), row[1].concat('AA')]);

  const returnValues = [];

  for (let splitPoint of splitPoints) {
    const nonZeroFlowPointsHumanWithIndex1 = input
      .filter((item) => splitPoint[0].includes(item.valve))
      .filter((item) => item.valve === "AA" || item.flowRate !== 0)
      .map((item) => item.valve);
    const nonZeroFlowPointsHuman = input
      .filter((item) => splitPoint[0].includes(item.valve))
      .filter((item) => item.flowRate !== 0)
      .map((item) => item.valve);

    const distancesHuman = Object.entries(alg.floydWarshall(g))
      .filter((entry) => nonZeroFlowPointsHumanWithIndex1.includes(entry[0]))
      .map((entry) => ({
        from: entry[0],
        to: Object.entries(entry[1])
          .filter(
            ([pointName, { distance, predecessor }]) =>
              pointName !== entry[0] && nonZeroFlowPointsHuman.includes(pointName),
          )
          .map(([pointName, { distance, predecessor }]) => ({
            toPoint: pointName,
            distance,
          })),
      }));

    const nonZeroFlowPointsElephantWithIndex1 = input
      .filter((item) => splitPoint[1].includes(item.valve))
      .filter((item) => item.valve === "AA" || item.flowRate !== 0)
      .map((item) => item.valve);
    const nonZeroFlowPointsElephant = input
      .filter((item) => splitPoint[1].includes(item.valve))
      .filter((item) => item.flowRate !== 0)
      .map((item) => item.valve);

    const distancesElephant = Object.entries(alg.floydWarshall(g))
      .filter((entry) => nonZeroFlowPointsElephantWithIndex1.includes(entry[0]))
      .map((entry) => ({
        from: entry[0],
        to: Object.entries(entry[1])
          .filter(
            ([pointName, { distance, predecessor }]) =>
              pointName !== entry[0] && nonZeroFlowPointsElephant.includes(pointName),
          )
          .map(([pointName, { distance, predecessor }]) => ({
            toPoint: pointName,
            distance,
          })),
      }));

    const dfs = (startPoint, visited, time, distances) => {
      const returnVisited = [...visited, startPoint];
      const adjacents = distances
        .find((node) => node.from === startPoint)
        .to.filter((item) => !returnVisited.includes(item.toPoint))
        .filter((item) => item.distance + time < maxTime);

      const maxChild = Math.max(
        ...adjacents.map((adjacent) =>
          dfs(adjacent.toPoint, returnVisited, time + adjacent.distance + 1, distances),
        ),
        0,
      );

      const value =
        maxChild +
        (maxTime - time) *
          input.find((row) => row.valve === startPoint).flowRate;

      return value;
    };

    const resultHuman = dfs("AA", [], 0, distancesHuman);
    const resultElephant = dfs("AA", [], 0, distancesElephant);
    returnValues.push(resultHuman + resultElephant);
  }

  return Math.max(...returnValues);
};

run({
  part1: {
    tests: [
      {
        input: `
        Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        Valve BB has flow rate=13; tunnels lead to valves CC, AA
        Valve CC has flow rate=2; tunnels lead to valves DD, BB
        Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
        Valve EE has flow rate=3; tunnels lead to valves FF, DD
        Valve FF has flow rate=0; tunnels lead to valves EE, GG
        Valve GG has flow rate=0; tunnels lead to valves FF, HH
        Valve HH has flow rate=22; tunnel leads to valve GG
        Valve II has flow rate=0; tunnels lead to valves AA, JJ
        Valve JJ has flow rate=21; tunnel leads to valve II
        `,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        Valve BB has flow rate=13; tunnels lead to valves CC, AA
        Valve CC has flow rate=2; tunnels lead to valves DD, BB
        Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
        Valve EE has flow rate=3; tunnels lead to valves FF, DD
        Valve FF has flow rate=0; tunnels lead to valves EE, GG
        Valve GG has flow rate=0; tunnels lead to valves FF, HH
        Valve HH has flow rate=22; tunnel leads to valve GG
        Valve II has flow rate=0; tunnels lead to valves AA, JJ
        Valve JJ has flow rate=21; tunnel leads to valve II
        `,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
