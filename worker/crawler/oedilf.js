"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const chalk = require("chalk");
const hr = "-".repeat(process.stdout.columns) + "\n";
const MAIN_URL = "https://www.oedilf.com/db/Lim.php";
const REMOVAL_LIST = [/<br>/g, /(<([^>]+)>)/gi, /\"/g];
let N_APPROVED = 106640;

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const processHtml = (
  limerick = `That leather is fine, but forsooth,<br>It is <b>eelskin</b> in name, not in truth.<br>It's from fish that exude<br>Tons of slime (ew, how rude!),<br>And <i>hagfish-skin</i> sounds so uncouth.`
) => {
  REMOVAL_LIST.forEach((elem) => {
    limerick = limerick.replace(elem, "");
  });
  return limerick;
};

const getLimerick = async (mainUrl = MAIN_URL, nArrpoved = N_APPROVED) => {
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  const dir = `./raw/limerick${Date.now().toString()}`;
  fs.mkdirSync(dir);

  for (let vid = 1; vid <= nArrpoved; vid++) {
    const page = await browser.newPage();
    await page.goto(mainUrl + `?VerseId=A${vid}`);
    console.log(`Fetching ${mainUrl}?VerseId=A${vid}`);
    try {
      let raw = await page.$eval(
        `#content .limerickverse`,
        (elem) => elem.innerHTML
      );
      results.push(processHtml(raw));
    } catch (error) {
      console.log(error);
      console.log(`VerseId: A${vid} is not available. Skip.`);
      results.push("not available");
      continue;
    }

    await fs.writeFileSync(`${dir}/oedilf-${vid}.txt`, results[vid - 1]);
    page.close();
    sleep(200);
  }

  process.exit(0);
};

getLimerick();
