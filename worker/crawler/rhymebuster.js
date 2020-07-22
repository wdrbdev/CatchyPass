"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const chalk = require("chalk");
const hr = "-".repeat(process.stdout.columns) + "\n";

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const getSentences = async (
  genres = "song:rap", // ["song:rap", "verse:sonet", "song:nursery"]
  rhymeScheme = "couplet", // ["couplet", "alternate", "monorhyme", "limerick", "rubaiyat"]
  nIteration = 1,
  fileName = "rhymebuster.json",
  exit = true
) => {
  const url = "https://www.rhymebuster.com/rapgenerator";
  console.log(
    chalk.green(
      `Starting retrieving ${nIteration} data from:\n${JSON.stringify({
        url,
        genres,
        rhymeScheme,
      })}\n`
    )
  );

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const chosenGenres = await page.$(`[value='${genres}']`);
  await chosenGenres.click();
  await page.select("select#rhymeScheme", rhymeScheme);

  const sentences = [];
  for (let i = 0; i < nIteration; i++) {
    await page.click("button#bustFurther");

    try {
      await page.waitFor(".songLine");
    } catch (error) {
      console.log(chalk.red(`${hr}Error in getSentences: ${error}\n${hr}`));
      await page.click("button#clearSong");
      await page.click("button#bustFurther");
      i--;
      continue;
    }

    let sentence = "";
    for (let nSentence = 0; nSentence < 4; nSentence++) {
      sentence += await page.$eval(
        `#songText${nSentence}`,
        (elem) => elem.innerHTML
      );

      if (![",", ".", "!", "?", ":", ";"].includes(sentence.slice(-1)))
        sentence += ".";
      sentence += " ";
    }

    sentences.push({
      genres,
      rhymeScheme,
      sentence,
    });

    console.log(`Retrieving ${i + 1} sentence(s).`);
    console.log(`Sentence = ${sentence}\n`);
    await page.click("button#clearSong");

    sleep(20);
  }

  const jsonString = JSON.stringify(sentences);
  console.log(`Finishing retrieval of ${nIteration} data\n`);
  fs.writeFileSync(fileName, jsonString);
  await browser.close();

  if (exit) {
    process.exit(0);
  }
};

(async (totalIteration) => {
  const batchSize = 50;
  const round = ~~(totalIteration / batchSize);
  for (let i = 0; i < round; i++) {
    try {
      await getSentences(
        "song:rap",
        "couplet",
        batchSize,
        `rhymebuster-${i}.json`,
        false
      );
    } catch (error) {
      console.log(chalk.red(`${hr}Error in totalIteration: ${error}\n${hr}`));
      i--;
      continue;
    }
    console.log(
      chalk.greenBright(
        `${hr}Finishing reprieving ${
          batchSize * (i + 1)
        }/${totalIteration} data\n${hr}`
      )
    );
  }
  process.exit(0);
})(150000);
