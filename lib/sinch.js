require('dotenv').config();

const { DEBUG } = process.env;

function log(callEvent) {
  if (DEBUG === 'ON') {
    console.log(callEvent);
  }
}

module.exports = { log };
