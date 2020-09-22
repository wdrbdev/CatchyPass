const fs = require("fs");
const path = require("path");
const RAW_DATA_DIR = "./raw";
const JSON_OUTPUT = "dataset.json";

fs.readdir(RAW_DATA_DIR, (err, files) => {
  const resultArray = files
    .filter((file) => {
      return file.match(/^.*\.json$/);
    })
    .map((file) => {
      let json = fs.readFileSync(path.join(RAW_DATA_DIR, file), "utf8");
      return JSON.parse(json);
    });
  const result = [].concat.apply([], resultArray);
  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(result));
});
