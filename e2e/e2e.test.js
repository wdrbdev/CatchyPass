const axios = require("axios");
const config = require("./config");
const rootUrl = "http://staging.albertapp.codes"; //`http://${config.reservedIp}`

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

beforeEach(async () => {
  jest.setTimeout(100000);
  await page.goto(rootUrl);
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
  test("Users will see project name", async () => {
    const projectName = await page.$eval(
      ".navbar-item .is-size-4",
      (elem) => elem.innerHTML
    );
    expect(projectName).toEqual("CatchyPass");
  });
  // TODO Can navigate to tutorial
  // TODO Can navigate to about
});

describe("Users can use random keywords", () => {
  beforeEach(async () => {
    await page.click("button#randomly-submit-btn");
    sleep(20000);
  });

  test("And generate limerick with 5 lines.", async () => {
    const limerickResult = await page.$eval(
      "#limerick-result .is-11",
      (elem) => elem.innerHTML
    );
    expect(limerickResult.length > 1).toBeTruthy();
  });

  test("And generate password.", async () => {
    const passwordResult = await page.$eval(
      "#password .is-11",
      (elem) => elem.innerHTML
    );
    console.log(passwordResult);

    expect(passwordResult.length > 1).toBeTruthy();
  });
});

describe("Users can type 1 keyword", () => {
  beforeEach(async () => {
    await page.$eval(`input[name="keyword 1"]`, (elem) => {
      elem.value = "test";
    });
    await page.click("button#submit-btn");
    sleep(20000);
  });

  test("And generate limerick.", async () => {
    const limerickResult = await page.$eval(
      "#limerick-result .is-11",
      (elem) => elem.innerHTML
    );
    console.log(limerickResult);
    expect(limerickResult.length > 1).toBeTruthy();
  });

  test("And generate password.", async () => {
    const passwordResult = await page.$eval(
      "#password .is-11",
      (elem) => elem.innerHTML
    );
    console.log(passwordResult);

    expect(passwordResult.length > 1).toBeTruthy();
  });
});
