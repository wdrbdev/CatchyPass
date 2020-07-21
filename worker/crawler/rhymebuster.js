"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");

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
  console.log(`Starting retrieving ${nIteration} data from:`);
  console.log("%j\n", {
    url,
    genres,
    rhymeScheme,
  });

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
      console.log(error);
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

    sleep(500);
  }

  const jsonString = JSON.stringify(sentences);
  console.log(`End result:\n${jsonString}`);

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
    await getSentences(
      "song:rap",
      "couplet",
      batchSize,
      `rhymebuster-${i}.json`,
      false
    );
    console.log("\n##############################");
    console.log(
      `Reprieving ${batchSize} data (${batchSize * (i + 1)}/${totalIteration})`
    );
    console.log("##############################\n");
  }
})(10000);
