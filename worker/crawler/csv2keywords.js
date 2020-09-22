const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const CsvReadableStream = require("csv-reader");
const KEYWORD_REGEX = /@.*~:/g;
const CHAR_REGEX = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/g;

OUTPUT_DIR = path.join("result", "output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}
const CSV_INPUT_PATH = path.join("result", "keyword_result.csv");
const TXT_OUTPUT_PATH = path.join(OUTPUT_DIR, "keywords.txt");

// The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
// It will pass a properly decoded data to the CsvReader.
const inputStream = fs.createReadStream(CSV_INPUT_PATH, "utf8");
const keywords = [];
inputStream
  .pipe(
    new CsvReadableStream({
      trim: true,
      skipHeader: true,
    })
  )
  .on("data", (row) => {
    console.log(`Pushing ${row}`);
    let word = row
      .toString()
      .match(KEYWORD_REGEX)[0]
      .replace(/@/g, "")
      .replace(/~:/g, "");
    if (!word.match(CHAR_REGEX)) keywords.push(word);
  })
  .on("end", (data) => {
    const result = Object.entries(_.countBy(keywords))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 200)
      .map((elem) => {
        return elem[0];
      });
    console.dir(result, { maxArrayLength: null });
    fs.writeFileSync(TXT_OUTPUT_PATH, result.join("\n"));
  });
