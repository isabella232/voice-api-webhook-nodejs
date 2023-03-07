require('dotenv').config();

const DEBUG = process.env.DEBUG

function log(callEvent) {

  if(DEBUG === 'ON') { 
      console.log(callEvent);
  }
}

module.exports = { log }
