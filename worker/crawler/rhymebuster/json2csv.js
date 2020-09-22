const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const JSON_FILE_PATH = "./dataset.json";
const CSV_FILE_PATH = "./dataset.csv";

const json = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf-8"));
const mergedJson = json.map(({ genres, rhymeScheme, sentence }) => {
  return {
    category: `${genres}&${rhymeScheme}`,
    sentence,
  };
});

const csvWriter = createCsvWriter({
  path: CSV_FILE_PATH,
  header: [
    { id: "category", title: "category" },
    { id: "sentence", title: "sentence" },
  ],
});

csvWriter.writeRecords(mergedJson);
