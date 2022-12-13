import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((pairs) => pairs.split("\n").map((row) => JSON.parse(row)));

const getArrayDepth = (value) =>
  Array.isArray(value) ? 1 + Math.max(0, ...value.map(getArrayDepth)) : 0;

const comparePair = (
  left: Array<number> | number,
  right: Array<number> | number,
) => {
  if (left === undefined) {
    // console.log(
    //   `0-1 Compare ${JSON.stringify(left)} to ${JSON.stringify(
    //     right,
    //   )}, value: true`,
    // );
    return true;
  } else if (right === undefined) {
    // console.log(
    //   `0-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
    //     right,
    //   )}, value: false`,
    // );
    return false;
  }
  if (Array.isArray(left) && !Array.isArray(right)) {
    const arrayedRight = [right];
    for (let i = 0; i < (left as Array<number>).length; i++) {
      const value = comparePair(left[i], arrayedRight[i]);
      if (value !== undefined) {
        // console.log(
        //   `1-1 Compare ${JSON.stringify(left[i])} to ${JSON.stringify(
        //     arrayedRight[i],
        //   )}, value: ${value}`,
        // );
        return value;
      }
      if (i === (left as Array<number>).length - 1) {
        if (left[i] === undefined && arrayedRight[i] === undefined) {
          return undefined;
        } else if (left[i] === undefined) {
          return true;
        } else if (arrayedRight[i] === undefined) {
          return false;
        }
      }
    }
    if (getArrayDepth(left) > getArrayDepth(arrayedRight)) {
      // console.log(
      //   `1-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     arrayedRight,
      //   )}, value: false`,
      // );
      return false;
    } else if (getArrayDepth(left) === getArrayDepth(arrayedRight)) {
      // console.log(
      //   `1-3 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     arrayedRight,
      //   )}, value: ${left.length === arrayedRight.length ? undefined : left.length < arrayedRight.length}`,
      // );
      return left.length === arrayedRight.length ? undefined : left.length < arrayedRight.length;
    } else {
      // console.log(
      //   `1-4 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     arrayedRight,
      //   )}, value: true`,
      // );
      return true;
    }
  } else if (!Array.isArray(left) && Array.isArray(right)) {
    const arrayedLeft = [left];
    for (let i = 0; i < arrayedLeft.length; i++) {
      const value = comparePair(arrayedLeft[i], right[i]);
      if (value !== undefined) {
        // console.log(
        //   `2-1 Compare ${JSON.stringify(arrayedLeft[i])} to ${JSON.stringify(
        //     right[i],
        //   )}, value: ${value}`,
        // );
        return value;
      }
      if (i === arrayedLeft.length - 1) {
        if (arrayedLeft[i] === undefined && right[i] === undefined) {
          return undefined;
        } else if (arrayedLeft[i] === undefined) {
          return true;
        } else if (right[i] === undefined) {
          return false;
        }
      }
    }
    if (getArrayDepth(arrayedLeft) > getArrayDepth(right as Array<number>)) {
      // console.log(
      //   `2-2 Compare ${JSON.stringify(arrayedLeft)} to ${JSON.stringify(
      //     right,
      //   )}, value: false`,
      // );
      return false;
    } else if (getArrayDepth(arrayedLeft) === getArrayDepth(right as Array<number>)) {
      // console.log(
      //   `2-3 Compare ${JSON.stringify(arrayedLeft)} to ${JSON.stringify(
      //     right,
      //   )}, value: ${arrayedLeft.length === right.length ? undefined : arrayedLeft.length < right.length}`,
      // );
      return arrayedLeft.length === right.length ? undefined : arrayedLeft.length < right.length;
    } else {
      // console.log(
      //   `2-4 Compare ${JSON.stringify(arrayedLeft)} to ${JSON.stringify(
      //     right,
      //   )}, value: true`,
      // );
      return true;
    }
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < (left as Array<number>).length; i++) {
      const value = comparePair((left as Array<number>)[i], right[i]);
      if (value !== undefined) {
        // console.log(
        //   `3-1 Compare ${JSON.stringify(left[i])} to ${JSON.stringify(
        //     right[i],
        //   )}, value: ${value}`,
        // );
        return value;
      }
      if (i === (left as Array<number>).length - 1) {
        if (left[i] === undefined && right[i] === undefined) {
          return undefined;
        } else if (left[i] === undefined) {
          return true;
        } else if (right[i] === undefined) {
          return false;
        }
      }
    }
    if (
      getArrayDepth(left) >
      getArrayDepth(right)
    ) {
      // console.log(
      //   `3-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     right,
      //   )}, value: false`,
      // );
      return false;
    } else if (getArrayDepth(left) === getArrayDepth(right)) {
      // console.log(
      //   `3-3 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     right,
      //   )}, value: ${left.length === right.length ? undefined : left.length < right.length}`,
      // );
      return left.length === right.length ? undefined : left.length < right.length;
    } else {
      // console.log(
      //   `3-4 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     right,
      //   )}, value: true`,
      // );
      return true;
    }
  } else if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left === right) {
      // console.log(
      //   `4-1 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     right,
      //   )}, value: undefined`,
      // );
      return undefined;
    }
    if (left < right) {
      // console.log(
      //   `4-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
      //     right,
      //   )}, value: true`,
      // );
      return true;
    }
    // console.log(
    //   `4-3 Compare ${JSON.stringify(left)} to ${JSON.stringify(
    //     right,
    //   )}, value: false`,
    // );
    return false;
  }
};

const sortPair = (
  left: Array<number> | number,
  right: Array<number> | number,
) => {
  if (left === undefined) {
    console.log(
      `0-1 Compare ${JSON.stringify(left)} to ${JSON.stringify(
        right,
      )}, value: -1`,
    );
    return -1;
  } else if (right === undefined) {
    console.log(
      `0-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
        right,
      )}, value: 1`,
    );
    return 1;
  }
  if (Array.isArray(left) && !Array.isArray(right)) {
    const arrayedRight = [right];
    for (let i = 0; i < (left as Array<number>).length; i++) {
      const value = comparePair(left[i], arrayedRight[i]);
      if (value !== undefined) {
        console.log(
          `1-1 Compare ${JSON.stringify(left[i])} to ${JSON.stringify(
            arrayedRight[i],
          )}, value: ${value ? -1 : 1}`,
        );
        return value ? -1 : 1;
      }
      if (i === (left as Array<number>).length - 1) {
        if (left[i] === undefined && arrayedRight[i] === undefined) {
          return 0;
        } else if (left[i] === undefined) {
          return -1;
        } else if (arrayedRight[i] === undefined) {
          return 1;
        }
      }
    }
    if (getArrayDepth(left) > getArrayDepth(arrayedRight)) {
      console.log(
        `1-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          arrayedRight,
        )}, value: 1`,
      );
      return 1;
    } else if (getArrayDepth(left) === getArrayDepth(arrayedRight)) {
      console.log(
        `1-3 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          arrayedRight,
        )}, value: ${left.length === arrayedRight.length ? 0 : left.length < arrayedRight.length ? -1 : 1}`,
      );
      return left.length === arrayedRight.length ? 0 : left.length < arrayedRight.length ? -1 : 1;
    } else {
      console.log(
        `1-4 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          arrayedRight,
        )}, value: -1`,
      );
      return -1;
    }
  } else if (!Array.isArray(left) && Array.isArray(right)) {
    const arrayedLeft = [left];
    for (let i = 0; i < arrayedLeft.length; i++) {
      const value = comparePair(arrayedLeft[i], right[i]);
      if (value !== undefined) {
        console.log(
          `2-1 Compare ${JSON.stringify(arrayedLeft[i])} to ${JSON.stringify(
            right[i],
          )}, value: ${value ? -1 : 1}`,
        );
        return value ? -1 : 1;
      }
      if (i === arrayedLeft.length - 1) {
        if (arrayedLeft[i] === undefined && right[i] === undefined) {
          return 0;
        } else if (arrayedLeft[i] === undefined) {
          return -1;
        } else if (right[i] === undefined) {
          return 1;
        }
      }
    }
    if (getArrayDepth(arrayedLeft) > getArrayDepth(right as Array<number>)) {
      console.log(
        `2-2 Compare ${JSON.stringify(arrayedLeft)} to ${JSON.stringify(
          right,
        )}, value: 1`,
      );
      return 1;
    } else if (getArrayDepth(arrayedLeft) === getArrayDepth(right as Array<number>)) {
      console.log(
        `2-3 Compare ${JSON.stringify(arrayedLeft)} to ${JSON.stringify(
          right,
        )}, value: ${arrayedLeft.length === right.length ? 0 : arrayedLeft.length < right.length ? -1 : 1}`,
      );
      return arrayedLeft.length === right.length ? 0 : arrayedLeft.length < right.length ? -1 : 1;
    } else {
      console.log(
        `2-4 Compare ${JSON.stringify(arrayedLeft)} to ${JSON.stringify(
          right,
        )}, value: -1`,
      );
      return -1;
    }
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < (left as Array<number>).length; i++) {
      const value = comparePair((left as Array<number>)[i], right[i]);
      if (value !== undefined) {
        console.log(
          `3-1 Compare ${JSON.stringify(left[i])} to ${JSON.stringify(
            right[i],
          )}, value: ${value ? -1 : 1}`,
        );
        return value ? -1 : 1;
      }
      if (i === (left as Array<number>).length - 1) {
        if (left[i] === undefined && right[i] === undefined) {
          return 0;
        } else if (left[i] === undefined) {
          return -1;
        } else if (right[i] === undefined) {
          return 1;
        }
      }
    }
    if (
      getArrayDepth(left) >
      getArrayDepth(right)
    ) {
      console.log(
        `3-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          right,
        )}, value: 1`,
      );
      return 1;
    } else if (getArrayDepth(left) === getArrayDepth(right)) {
      console.log(
        `3-3 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          right,
        )}, value: ${left.length === right.length ? 0 : left.length < right.length ? -1 : 1}`,
      );
      return left.length === right.length ? 0 : left.length < right.length ? -1 : 1;
    } else {
      console.log(
        `3-4 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          right,
        )}, value: -1`,
      );
      return -1;
    }
  } else if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left === right) {
      console.log(
        `4-1 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          right,
        )}, value: 0`,
      );
      return 0;
    }
    if (left < right) {
      console.log(
        `4-2 Compare ${JSON.stringify(left)} to ${JSON.stringify(
          right,
        )}, value: -1`,
      );
      return -1;
    }
    console.log(
      `4-3 Compare ${JSON.stringify(left)} to ${JSON.stringify(
        right,
      )}, value: 1`,
    );
    return 1;
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input
    .map((pair, index) => (comparePair(pair[0], pair[1]) ? index + 1 : 0))
    .reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).flat();
  const two = [[2]];
  const six = [[6]];
  input.push(two);
  input.push(six);
  const sorted = input.sort(sortPair);

  return (sorted.findIndex(item => item === two) + 1) * (sorted.findIndex(item => item === six) + 1);
};

run({
  part1: {
    tests: [
      {
        input: `
        [1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        [1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
