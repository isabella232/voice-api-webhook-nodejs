require('dotenv').config();
const crypto = require("crypto");

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;

  function precall() {
    let configCheck = 0

    if( APP_KEY || APP_SECRET ) { 
        let configCheck = 1;
        return configCheck;
    }
    else { 
        return configCheck;
    }
  }

  function verify (request) {
    
    let hash = crypto.createHash("md5");
    let authHeader = request.header("Authorization");
    let requestBody = request.body;
    let requestMethod = request.method;
    const authValue = authHeader.split(/[ :]/);
    const callbackKey = authValue[1];
    const callbackSignature = authValue[2];

    if (callbackKey !== APP_KEY) {
      let verificationStatus = 0;
      return verificationStatus;
    }

    const contentMD5 = hash.update(request.body).digest("base64");
    const requestContentType = request.header("Content-Type");
    const requestTimestamp = request.header("x-timestamp");
    const requestPath = request.baseUrl + request.path;

    let stringToSign = requestMethod +
      "\n" +
      contentMD5 +
      "\n" +
      requestContentType +
      "\n" +
      "x-timestamp:" +
      requestTimestamp +
      "\n" +
      requestPath;

    let hmac = crypto.createHmac(
      "sha256",
      Buffer.from(APP_SECRET, "base64")
    );
    hmac.update(stringToSign);
    let calculatedSignature = hmac.digest("base64");

    if (calculatedSignature !== callbackSignature) {
      const verificationStatus = 0;
      return verificationStatus;
    } else {
      const verificationStatus = 1;
      return verificationStatus;
    }
  }

module.exports = { verify, precall };
