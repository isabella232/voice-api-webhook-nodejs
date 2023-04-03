const express = require('express');
const sign = require('./lib/sign');
const sinch = require('./lib/sinch');

const app = express();
app.use(express.raw({ type: '*/*' }));
const port = 8000;
app.get('/', (req, res) => {
  res.send('GET Pong!');
});
app.post('/', (req, res) => {
  if (sign.verify(req) === 1) {
    const eventBody = JSON.parse(req.body.toString('utf8'));

    switch (eventBody.event) {
      case 'ice':
        /*
            Handle Incoming Call Event.
            https://developers.sinch.com/docs/voice/api-reference/voice/tag/Callback-API/#tag/Callback-API/operation/ice
        */
        sinch.log(eventBody);
        /* Return a SVAML response, json format */
        res.json({
          instructions: [
            {
              name: 'answer',
            },
            {
              name: 'say',
              text: 'Congrats! You controlled the call flow with a SVAML response. Going to hang up now, Bye!',
              locale: 'en-US',
            },
          ],
          action: {
            name: 'hangup',
          },
        });
        break;
      case 'ace':
        /*
            Handle a Answer Call Event.
            https://developers.sinch.com/docs/voice/api-reference/voice/tag/Callback-API/#tag/Callback-API/operation/ace
        */
        break;
      case 'pie':
        /*
            https://developers.sinch.com/docs/voice/api-reference/voice/tag/Callback-API/#tag/Callback-API/operation/pie
        */
        break;
      case 'dice':
        /*
           https://developers.sinch.com/docs/voice/api-reference/voice/tag/Callback-API/#tag/Callback-API/operation/dice
            Handle a Disconnect Call Event
            200 OK is expected
        */
        sinch.log(eventBody);
        res.sendStatus(200);
        break;
      case 'notify':
        /*
            https://developers.sinch.com/docs/voice/api-reference/voice/tag/Callback-API/#tag/Callback-API/operation/dice
            Handle a Disconnect Call Event
            200 OK is expected
        */
        res.sendStatus(200);
        break;

      default:
        res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

if (sign.precall() === 0) {
  console.log('Whoops! Please check your .env file exists and contains your APP_KEY and APP_SECRET');
  console.log('Fix this and run node index.js again.');
} else {
  app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
  });
}

/*
 * A good tip for storing your SVAML responses is to wrap them with a json object
 * and responding with res.json within the call event case statement. e.g The example below would be
 * res.json(confAnnoucement);

let confAnnoucement = {
  instructions: [
    {
      name: "say",
      text: "Conference test",
      locale: "en-US",
    },
  ],
  action: {
    name: "ConnectConf",
    conferenceId: "my-conference-id",
    suppressCallbacks: false,
    moh: "music2",
  },
};
*/
