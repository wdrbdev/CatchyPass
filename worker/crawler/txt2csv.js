const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const RAW_DATA_DIR = path.join("raw", "limerick_csv"); // limerick_csv, test
const RESULT_CSV = path.join("result", "result.csv");
const RESULT_TXT = path.join("result", "result.txt");
const LINE_DELIMITER = "<|n|>";
const TEXT_DELIMITER = "<|endoftext|>";
const N_LINES = 5;
// Discard limerick with any number, special character or latin character
const LIMERICK_REGEX = /[\d@#$%^&*_+\-\—=\[\]{}"\\|\/↑↑←→]|[ñáéíóúüßÄÖÜ]/;
const KEYWORD_REGEX = /[A-Z\d@#$%^&*_+\-\—=\[\]{}"\\|\/↑↑←→\'`]|[ñáéíóúüßÄÖÜ]/;

const KEYWORD_RESULT_TXT = path.join("result", "keyword_result.txt");
const KEYWORD_RESULT_CSV = path.join("result", "keyword_result.csv");
const N_KEYWORDS = 1;
const MAX_REPEAT = 16;
const N_UNIQUE_WORDS_FILTER = 5;
const DELIMS = /["()\[\]=\\!?´`<>|,;.:+_-]+/g;

// Remove pronounce, conjunctions, abbreviation, positions, auxiliary verbs (i.e. stop words) in keywords
const STOP_WORDS = fs
  .readFileSync("stopWords.txt", "utf8")
  .replace(/\n/g, " ")
  .split(" ");
console.log(`Stop word: ${STOP_WORDS.toString()}`);

let files = fs
  .readdirSync(RAW_DATA_DIR)
  .filter((file) => {
    console.log(`Filtering txt file for ${file}`);
    return file.match(/^.*\.txt$/);
  })
  .map((file) => {
    console.log(`Preprocessing file ${file}`);
    return fs.readFileSync(path.join(RAW_DATA_DIR, file), "utf8");
  });

const limericks = files
  .map((limerick) => {
    console.log(
      `Processing to ${
        limerick.split("\n").length
      } line(s) to ${N_LINES} line(s).`
    );
    return limerick.split("\n").slice(0, N_LINES).join("\n");
  })
  .filter((limerick) => {
    if (!LIMERICK_REGEX.test(limerick)) {
      return limerick;
    } else {
      console.log(
        `The limerick contains character in the exclusion list: ${limerick}. Skipped`
      );
    }
  })
  .filter((limerick) => {
    // Filter undefined pairs
    return limerick !== undefined;
  })
  .flat(1);

// // Save as TXT file
// const limerickString = limericks
//   .map((limerick) => {
//     return "@limerick~: " + limerick;
//   })
//   .join("\n\n");
// fs.writeFileSync(RESULT_TXT, limerickString);

// // Save as CSV file
// const limerickJson = limericks.map((limerick) => {
//   return { limerick };
// });
// let csvWriter = createCsvWriter({
//   path: RESULT_CSV,
//   header: [{ id: "limerick", title: "limerick" }],
// });
// csvWriter.writeRecords(limerickJson);

// Save as keyword files
const keywordPair = _.shuffle(
  limericks
    .map((limerick) => {
      const result = [];
      // console.log(`Processing txt to keyword from ${limerick}`);
      let keywords = Array.from(
        new Set(
          limerick
            .replace(/\n/g, " ")
            .replace(DELIMS, "")
            .split(" ")
            // .map((word) => {
            //   return word.toLowerCase();
            // })
            .filter((word) => {
              return word !== "" && !STOP_WORDS.includes(word);
            })
            .filter((word) => {
              return !KEYWORD_REGEX.test(word);
            })
        )
      );

      // Expect that limericks has at least 5 different words. If not, discard it.
      if (keywords.length < N_UNIQUE_WORDS_FILTER) {
        // console.log(`# of unique words in "${limerick}" is too few. Skipped.`);
        return;
      }

      let usedKeywords = new Set([""]);
      let retryCount = 0;
      for (let i = 0; i <= MAX_REPEAT; i++) {
        let keyword = _.shuffle(keywords)
          .slice(0, Math.floor(Math.random() * (N_KEYWORDS + 1)))
          .sort()
          .join(" ");
        if (!usedKeywords.has(keyword)) {
          result.push({ keyword, limerick });
          usedKeywords.add(keyword);
        } else {
          i--;
          retryCount++;
        }
        if (retryCount > MAX_REPEAT * 8) {
          break;
        }
      }
      return result;
    })
    .filter((pair) => {
      // Filter undefined pairs
      return pair !== undefined;
    })
    .flat(1)
    .map(({ keyword, limerick }) => {
      // 5 lines version
      return `#${keyword}: ${
        limerick.replace(/\n/g, " " + LINE_DELIMITER + " ") +
        " " +
        TEXT_DELIMITER
      }`;

      // 6 lines version
      // let keywordTags = "";
      // keyword.split(" ").forEach((word) => {
      //   keywordTags += `#${word} `;
      // });
      // return `${keywordTags}${LINE_DELIMITER} ${limerick.replace(
      //   /\n/g,
      //   " " + LINE_DELIMITER + " "
      // )} ${TEXT_DELIMITER}`;
    })
);

fs.writeFileSync(KEYWORD_RESULT_TXT, keywordPair.join("\n\n"));

csvWriter = createCsvWriter({
  path: KEYWORD_RESULT_CSV,
  header: [{ id: "limerick", title: "limerick" }],
});
const keywordPairsJson = keywordPair.map((limerick) => {
  return { limerick };
});
csvWriter.writeRecords(keywordPairsJson);

console.log(keywordPair.slice(0, 5));

console.log("-".repeat(process.stdout.columns));
console.log(`# of input files = ${files.length}`);
console.log(`# of data output after filtration = ${limericks.length}`);
const percentage = ((1 - limericks.length / files.length) * 100).toFixed(2);
console.log(`Filtered out ${percentage}% of data`);
console.log(`# of data output with keywords = ${keywordPair.length}`);
console.log("-".repeat(process.stdout.columns));
