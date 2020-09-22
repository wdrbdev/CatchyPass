const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const CsvReadableStream = require("csv-reader");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

OUTPUT_DIR = path.join("result", "output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}
const CSV_INPUT_PATH = path.join("result", "keyword_result.csv");
const CSV_OUTPUT_PATH = path.join(OUTPUT_DIR, "keyword_result_shuffled.csv");

// The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
// It will pass a properly decoded data to the CsvReader.
const inputStream = fs.createReadStream(CSV_INPUT_PATH, "utf8");
const limericks = [];
inputStream
  .pipe(
    new CsvReadableStream({
      trim: true,
      skipHeader: true,
    })
  )
  .on("data", (row) => {
    console.log(`Pushing ${row}`);
    limericks.push(row);
  })
  .on("end", (data) => {
    console.log("End of rows");
    console.log(`# of data = ${limericks.length}`);

    limericksJson = _.shuffle(limericks).map((limerick) => {
      return { limerick };
    });
    console.log(limericksJson.slice(0, 5));

    csvWriter = createCsvWriter({
      path: CSV_OUTPUT_PATH,
      header: [{ id: "limerick", title: "limerick" }],
    });
    csvWriter.writeRecords(limericksJson);
  });
