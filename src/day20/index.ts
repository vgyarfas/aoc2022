import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(Number);

function arrayMoveMutable(array, fromIndex, toIndex) {
	const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

	if (startIndex >= 0 && startIndex < array.length) {
		const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

		const [item] = array.splice(fromIndex, 1);
		array.splice(endIndex, 0, item);
	}
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let orderObj = input.map((num, index) => ({num, order: index}));

  for(let i = 0; i < input.length; i++) {
    const target = orderObj.find(obj => obj.order === i);
    const indexOfTarget = orderObj.findIndex(obj => obj.order === i);
    if(target.num < 0 && Math.abs(target.num) > (indexOfTarget - 1)) {
      arrayMoveMutable(orderObj, indexOfTarget, (target.num + (indexOfTarget - 1)) % (input.length - 1))
    } else if(target.num > 0 && target.num > (input.length - indexOfTarget - 1)) {
      arrayMoveMutable(orderObj, indexOfTarget, (target.num - (input.length - indexOfTarget - 1)) % (input.length - 1))
    } else {
      arrayMoveMutable(orderObj, indexOfTarget, indexOfTarget + target.num);
    }
  }

  //console.log(orderObj.map(obj => obj.num).join(', '));

  const zeroIndex = orderObj.findIndex(obj => obj.num === 0);
  //console.log({1000: orderObj[(zeroIndex + 1000) % input.length], 2000: orderObj[(zeroIndex + 2000) % input.length], 3000: orderObj[(zeroIndex + 3000) % input.length]})


  return orderObj[(zeroIndex + 1000) % input.length].num + orderObj[(zeroIndex + 2000) % input.length].num + orderObj[(zeroIndex + 3000) % input.length].num;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const decryptionKey = 811589153;
  let orderObj = input.map((num, index) => ({num: num * decryptionKey, order: index, realNum: (num * decryptionKey) % (input.length - 1)}));
  //console.log(orderObj.map(obj => obj.realNum).join(', '));
  //console.log("-------------------------");

  for(let x = 0; x < 10; x++) {
    for(let i = 0; i < input.length; i++) {
      const target = orderObj.find(obj => obj.order === i);
      const indexOfTarget = orderObj.findIndex(obj => obj.order === i);
      if(target.realNum < 0 && Math.abs(target.realNum) > (indexOfTarget - 1)) {
        if(x === 2) console.log(`Num ${target.realNum} at ${indexOfTarget} in first condition; target index: ${(target.realNum + (indexOfTarget - 1)) % (input.length - 1)}`)
        arrayMoveMutable(orderObj, indexOfTarget, (target.realNum + (indexOfTarget - 1)) % (input.length - 1))
      } else if(target.realNum > 0 && target.realNum > (input.length - indexOfTarget - 1)) {
        if(x === 2) console.log(`Num ${target.realNum} at ${indexOfTarget} in second condition; target index: ${(target.realNum - (input.length - indexOfTarget - 1)) % (input.length - 1)}`)
        arrayMoveMutable(orderObj, indexOfTarget, (target.realNum - (input.length - indexOfTarget - 1)) % (input.length - 1))
      } else if(target.realNum < 0) {
        if(x === 2) console.log(`Num ${target.realNum} at ${indexOfTarget} in third condition; target index: ${indexOfTarget + target.realNum + 1}`)
        arrayMoveMutable(orderObj, indexOfTarget, indexOfTarget + target.realNum);
      } else {
        if(x === 2) console.log(`Num ${target.realNum} at ${indexOfTarget} in forth condition; target index: ${indexOfTarget + target.realNum}`)
        arrayMoveMutable(orderObj, indexOfTarget, indexOfTarget + target.realNum);
      }
      //console.log(orderObj.map(obj => obj.realNum).join(', '));
    }
    //console.log("-------------------------");
    //console.log(orderObj.map(obj => obj.realNum).join(', '));
  }

  //console.log(orderObj.map(obj => obj.num).join(', '));

  const zeroIndex = orderObj.findIndex(obj => obj.num === 0);
  //console.log({1000: orderObj[(zeroIndex + 1000) % input.length], 2000: orderObj[(zeroIndex + 2000) % input.length], 3000: orderObj[(zeroIndex + 3000) % input.length]})


  return orderObj[(zeroIndex + 1000) % input.length].num + orderObj[(zeroIndex + 2000) % input.length].num + orderObj[(zeroIndex + 3000) % input.length].num;
};

run({
  part1: {
    tests: [
      {
        input: `
        1
        2
        -3
        3
        -2
        0
        4
        `,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1
        2
        -3
        3
        -2
        0
        4
        `,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
