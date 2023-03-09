require('dotenv').config();
const crypto = require('crypto');

const { APP_KEY } = process.env;
const { APP_SECRET } = process.env;

function precall() {
  if (APP_KEY || APP_SECRET) {
    const configCheck = 1;
    return configCheck;
  }
  const configCheck = 0;
  return configCheck;
}

function verify(request) {
  const hash = crypto.createHash('md5');
  const authHeader = request.header('Authorization');
  const requestBody = request.body;
  const requestMethod = request.method;
  const authValue = authHeader.split(/[ :]/);
  const callbackKey = authValue[1];
  const callbackSignature = authValue[2];

  if (callbackKey !== APP_KEY) {
    const verificationStatus = 0;
    return verificationStatus;
  }

  const contentMD5 = hash.update(request.body).digest('base64');
  const requestContentType = request.header('Content-Type');
  const requestTimestamp = request.header('x-timestamp');
  const requestPath = request.baseUrl + request.path;

  const stringToSign = `${requestMethod
  }\n${
    contentMD5
  }\n${
    requestContentType
  }\n`
      + `x-timestamp:${
        requestTimestamp
      }\n${
        requestPath}`;

  const hmac = crypto.createHmac(
    'sha256',
    Buffer.from(APP_SECRET, 'base64'),
  );
  hmac.update(stringToSign);
  const calculatedSignature = hmac.digest('base64');

  if (calculatedSignature !== callbackSignature) {
    const verificationStatus = 0;
    return verificationStatus;
  }
  const verificationStatus = 1;
  return verificationStatus;
}

module.exports = { verify, precall };
