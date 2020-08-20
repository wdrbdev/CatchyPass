const puppeteer = require("puppeteer");
const axios = require("axios");
const config = require("./config");
const rootUrl = `http://${config.reservedIp}`;

const browser = await puppeteer.launch({
  headless: true,
});
let page;

beforeEach(async () => {
  jest.setTimeout(100000);

  page = await browser.newPage();
  await page.goto(rootUrl);
});

afterEach(async () => {
  await page.close();
});

test("Test IP address in env variable.", () => {
  expect(config.reservedIp).toEqual("35.220.154.72");
});

test("Test whether API root URL is available.", async () => {
  console.log(`Testing ${rootUrl}/api`);
  const res = await axios.get(`${rootUrl}/api`);
  expect(res.data).toEqual("Hello there!");
});

describe("When users go to the website,", () => {
  test("Users will see project name",()=>{
    const projectName = await page.$eval(
      ".navbar-item .is-size-4",
      (elem) => elem.innerHTML
    );
    expect(projectName).toEqual("CatchyPass")
  })

});
