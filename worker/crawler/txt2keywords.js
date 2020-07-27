const fs = require("fs");
const _ = require("lodash");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const TXT_FILE_NAME = "dataset";
const N_KEYWORDS = 2;
const MAX_REPEAT = 8;
const DELIMS = [".", ",", ":", ";"];
// TODO list of exclusion

const txt = fs.readFileSync(TXT_FILE_NAME + ".txt", "utf-8").split("\n");
const lines = txt
  .map((line) => {
    const result = [];
    let keywords = Array.from(
      new Set(
        line
          .split(" ")
          .map((word) => {
            DELIMS.forEach((delim) => {
              if (word.includes(delim)) {
                word.replace(delim, "");
              }
            });
            return word;
          })
          .filter((elem) => {
            return elem !== "";
          })
      )
    );

    let usedKeywords = new Set();
    for (let i = 0; i <= MAX_REPEAT; i++) {
      let keyword = _.shuffle(keywords)
        .slice(0, Math.floor(Math.random() * (N_KEYWORDS + 1)))
        .sort()
        .join(" ");
      if (!usedKeywords.has(keyword)) {
        result.push({ keyword, sentence: line });
        usedKeywords.add(keyword);
      }
    }
    return result;
  })
  .flat(1);

const csvWriter = createCsvWriter({
  path: TXT_FILE_NAME + "_encoded.csv",
  header: [
    { id: "keyword", title: "keyword" },
    { id: "sentence", title: "sentence" },
  ],
});
csvWriter.writeRecords(lines);
