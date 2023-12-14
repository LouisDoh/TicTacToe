import {calculateWinner} from "../src/App.js"

const mockTest = jest.fn((num1,num2) => num1+num2);

function sum(num1, num2) {
  return(num1+num2);
}

test("1 + 1 = 2", () => {
  expect(sum(1,1)).toBe(2);
});

test("MOCK 1 + 1 = 2", () => {
  expect(mockTest(1,1)).toBe(2);
});

test("Calculate Winner", () => {
  let myArr = Array(3).fill(null);
  myArr[0] = "X";
  myArr[1] = "X";
  myArr[2] = "X";
  expect(calculateWinner(myArr)).toStrictEqual(["X",0,1,2]);
});
