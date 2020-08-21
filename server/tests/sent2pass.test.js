const sent2pass = require("../services/sent2pass");

const keyword1 = "flower";
const limerick1 =
  "I say grace every now and again\nIn the modernist style of the press.\nYou elect those who savor\nYour sound with a quarter,\nAnd frequently give me a pass.";
const keyword2 = "leet";
const limerick2 =
  "If they can't sell a shot at the pub,\nThen brown bagging it makes a good sub.\nWhen you're looking to fix her\nA drink, buy their mixer,\nAnd add your own booze at the club.";

test("sent2pass could generate password containing only letters.", () => {
  const result1 = "FlowerAgainPressPass";
  const reuslt2 = "LeetPubSubClub";
  expect(sent2pass(limerick1, [keyword1], "", false)).toEqual(result1);
  expect(sent2pass(limerick2, [keyword2], "", false)).toEqual(reuslt2);
});

test("sent2pass could generate password containing letters and numbers.", () => {
  const result1 = "F10w32AgainPressPass";
  const reuslt2 = "1337PubSubClub";

  expect(sent2pass(limerick1, [keyword1])).toEqual(result1);
  expect(sent2pass(limerick2, [keyword2])).toEqual(reuslt2);
});

test("sent2pass could generate password containing letters, numbers and special characters.", () => {
  const result1 = "F10w32.Again.Press.Pass";
  const reuslt2 = "1337.Pub.Sub.Club";

  expect(sent2pass(limerick1, [keyword1], ".")).toEqual(result1);
  expect(sent2pass(limerick2, [keyword2], ".")).toEqual(reuslt2);
});
