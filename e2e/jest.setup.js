/**
 * Initialization of setting for tests
 * To activate the script, set this file as "setupTestFrameworkScriptFile" in package.json
 */
const config = require("./config");

/*
 * Jest setting
 */
jest.setTimeout(600000);
// Fix "Error: Cross origin http://localhost forbidden"
global.XMLHttpRequest = undefined;

module.exports = {
  testURL: `http://${config.minikubeIP}/api/`,
};
