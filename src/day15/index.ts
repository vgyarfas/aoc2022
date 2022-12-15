import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((row) =>
      row
        .split("Sensor at ")[1]
        .split(": closest beacon is at ")
        .map((coords) =>
          coords.split(", ").map((item) => Number.parseInt(item.split("=")[1])),
        ),
    )
    .map((row) => ({
      sensor: {
        x: row[0][0],
        y: row[0][1],
      },
      closestBeacon: {
        x: row[1][0],
        y: row[1][1],
      },
    }));

function* range(start, end, step = 1) {
  while (start <= end) {
    yield start;
    start += step;
  }
}

let out = Array.from(range(10, 20));

const getAllBlockedPointsLength = (
  input: Array<any>,
  measuredRow: number,
  min = 0,
  max = 4000000,
) => {
  const measuredRowCoords = [];
  input
    .map((row) => ({
      ...row,
      manhattanDist:
        Math.abs(row.sensor.x - row.closestBeacon.x) +
        Math.abs(row.sensor.y - row.closestBeacon.y),
      measuredRowManhattanDist: Math.abs(row.sensor.y - measuredRow),
    }))
    .filter((row) => row.measuredRowManhattanDist < row.manhattanDist)
    .forEach((row) => {
      measuredRowCoords.push([
            Math.max(
              min,
              row.sensor.x - (row.manhattanDist - row.measuredRowManhattanDist),
            ),
            Math.min(
              max,
              row.sensor.x + row.manhattanDist - row.measuredRowManhattanDist,
            )]
        )},
    );

  return measuredRowCoords.sort((a, b) => a[0] - b[0]);
};

const mergeIntervals = (intervals) => {
  const returnArray = [];
  const sortedIntervals = intervals.sort((a, b) => a[0] - b[0]);
  returnArray.push(sortedIntervals[0]);
  for(let interval of sortedIntervals) {
    if(returnArray[returnArray.length - 1][1] + 1 < interval[0]) {
      returnArray.push(interval);
    } else if(returnArray[returnArray.length - 1][1] < interval[1]) {
      returnArray[returnArray.length - 1][1] = interval[1];
    }
  }
  
  return returnArray;
};

const part1 = (rawInput: string) => {
  const measuredRow = 2000000; //10;
  const input = parseInput(rawInput);
  const measuredRowCoords = getAllBlockedPointsLength(input, measuredRow, measuredRow * -10, measuredRow * 10);
  return Array.from(range(mergeIntervals(measuredRowCoords)[0][0], mergeIntervals(measuredRowCoords)[0][1], 1)).filter(
    (coordX) =>
      ![
        ...input
          .filter((row) => row.sensor.y === measuredRow)
          .map((row) => row.sensor.x),
        ...input
          .filter((row) => row.closestBeacon.y === measuredRow)
          .map((row) => row.closestBeacon.x),
      ].includes(coordX),
  ).length;
};

const part2 = (rawInput: string) => {
  const limits = 4000000; //20;
  const input = parseInput(rawInput);

  console.time("lab");
  for (let row = 0; row <= limits; row++) {
    if (row % 100000 === 0 || row < 10 || row === 1000) {
      console.log(`parsing row ${row}`);
      console.timeLog("lab");
    }
    const measuredRowCoords = getAllBlockedPointsLength(input, row);
    const uniqueCoords = mergeIntervals(measuredRowCoords)
    if(mergeIntervals(measuredRowCoords).length > 1) {
      console.log(row, uniqueCoords[0][1] + 1);
      return (
            row +
            4000000 *
              (uniqueCoords[0][1] + 1)
          );
    }
  }
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      //   Sensor at x=9, y=16: closest beacon is at x=10, y=16
      //   Sensor at x=13, y=2: closest beacon is at x=15, y=3
      //   Sensor at x=12, y=14: closest beacon is at x=10, y=16
      //   Sensor at x=10, y=20: closest beacon is at x=10, y=16
      //   Sensor at x=14, y=17: closest beacon is at x=10, y=16
      //   Sensor at x=8, y=7: closest beacon is at x=2, y=10
      //   Sensor at x=2, y=0: closest beacon is at x=2, y=10
      //   Sensor at x=0, y=11: closest beacon is at x=2, y=10
      //   Sensor at x=20, y=14: closest beacon is at x=25, y=17
      //   Sensor at x=17, y=20: closest beacon is at x=21, y=22
      //   Sensor at x=16, y=7: closest beacon is at x=15, y=3
      //   Sensor at x=14, y=3: closest beacon is at x=15, y=3
      //   Sensor at x=20, y=1: closest beacon is at x=15, y=3
      //   `,
      //   expected: 26,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `
      //   Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      //   Sensor at x=9, y=16: closest beacon is at x=10, y=16
      //   Sensor at x=13, y=2: closest beacon is at x=15, y=3
      //   Sensor at x=12, y=14: closest beacon is at x=10, y=16
      //   Sensor at x=10, y=20: closest beacon is at x=10, y=16
      //   Sensor at x=14, y=17: closest beacon is at x=10, y=16
      //   Sensor at x=8, y=7: closest beacon is at x=2, y=10
      //   Sensor at x=2, y=0: closest beacon is at x=2, y=10
      //   Sensor at x=0, y=11: closest beacon is at x=2, y=10
      //   Sensor at x=20, y=14: closest beacon is at x=25, y=17
      //   Sensor at x=17, y=20: closest beacon is at x=21, y=22
      //   Sensor at x=16, y=7: closest beacon is at x=15, y=3
      //   Sensor at x=14, y=3: closest beacon is at x=15, y=3
      //   Sensor at x=20, y=1: closest beacon is at x=15, y=3
      //   `,
      //   expected: 56000011,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
