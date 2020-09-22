"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const chalk = require("chalk");
const hr = "-".repeat(process.stdout.columns) + "\n";

const MAIN_URL = "https://www.oedilf.com/db/Lim.php";
const REMOVAL_LIST = [/<br>/g, /(<([^>]+)>)/gi, /\"/g];
let START_VID = 22846;
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
  for (let i = 0; i < START_VID - 1; i++) {
    results.push("empty");
  }

  const dir = `./raw/limerick${Date.now().toString()}`;
  fs.mkdirSync(dir);

  for (let vid = START_VID; vid <= nArrpoved; vid++) {
    console.log(`Fetching ${mainUrl}?VerseId=A${vid}`);
    const page = await browser.newPage();

    try {
      await page.goto(mainUrl + `?VerseId=A${vid}`);
    } catch (error) {
      console.log(chalk.redBright(error));
      console.log(chalk.redBright(`Navigation error for A${vid}. Retrying.`));
      vid--;
      continue;
    }

    try {
      let raw = await page.$eval(
        `#content .limerickverse`,
        (elem) => elem.innerHTML
      );
      results.push(processHtml(raw));
    } catch (error) {
      console.log(chalk.red(error));
      console.log(chalk.red(`VerseId A${vid} is not available. Skipped.`));
      results.push("not available");
      continue;
    }

    await fs.writeFileSync(`${dir}/oedilf-${vid}.txt`, results[vid - 1]);
    page.close();
    // sleep(200);
  }

  process.exit(0);
};

getLimerick();
