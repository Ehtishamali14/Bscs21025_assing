const fs = require('fs').promises;
const dataFile = './data/data.json';

async function readData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data:", err);
    return [];
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    console.log("Data saved successfully.");
  } catch (err) {
    console.error("Error writing data:", err);
  }
}

module.exports = { readData, writeData };
