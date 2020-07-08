const puppeteer = require("puppeteer");
const axios = require("axios");
const config = require("./config");
const testURL = `http://${config.minikubeIP}`;

test("Init test", () => {
  console.log(`minikube ip = ${config.minikubeIP}`);
  expect(1).toEqual(1);
});

test("Test whether API root URL is available.", async () => {
  console.log(`Testing ${testURL}/api`);
  const res = await axios.get(`${testURL}/api`);
  expect(res.data).toEqual("Hello there!");
});
