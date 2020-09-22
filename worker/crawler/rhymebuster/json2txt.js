const fs = require("fs");

const JSON_FILE_PATH = "./dataset.json";
const TXT_FILE_PATH = "./dataset.txt";

const json = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf-8"));
(async () => {
  await fs.writeFileSync(
    TXT_FILE_PATH,
    json
      .map(({ sentence }) => {
        return sentence;
      })
      .join("\n")
  );
})();
