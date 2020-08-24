const axios = require("axios");
const config = require("./config");
const rootUrl = "http://test.catchypass.me";

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

beforeEach(async () => {
  jest.setTimeout(100000);
  await page.goto(rootUrl);
});

test("Test IP address in env variable.", async () => {
  const res = await axios.get(`${rootUrl}`);
  expect(res.status).toEqual(200);
});

test("Test whether API root URL is available.", async () => {
  const res = await axios.get(`${rootUrl}/api`);
  expect(res.data).toEqual("Hello there!");
});

describe("When users navigate to the website,", () => {
  test("Users can see project name", async () => {
    const projectName = await page.$eval(
      ".navbar-item .is-size-4",
      (elem) => elem.innerHTML
    );
    expect(projectName).toEqual("CatchyPass");
  });

  test("Users can see tutorial page", async () => {
    await page.hover(".navbar-link");
    await page.click(`.navbar-item[href="/tutorial"]`);
    await page.waitFor("#tutorial-title");
    const tutorialTitle = await page.$eval(
      "#tutorial-title",
      (elem) => elem.innerHTML
    );
    expect(tutorialTitle).toEqual("CatchyPass - Tutorial");
  });

  test("Users can see about page", async () => {
    await page.hover(".navbar-link");
    await page.click(`.navbar-item[href="/about"]`);
    await page.waitFor("#about-title");
    const tutorialTitle = await page.$eval(
      "#about-title",
      (elem) => elem.innerHTML
    );
    expect(tutorialTitle).toEqual("CatchyPass - About");
  });
});

describe("Users can use random keywords", () => {
  beforeEach(async () => {
    await page.click("button#randomly-submit-btn");
    sleep(60000);
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
    sleep(60000);
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
