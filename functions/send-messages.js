// eslint-disable-next-line consistent-return
exports.handler = function (context, event, callback) {
  const phoneNumbers = event.recipients.split(',').map((x) => x.trim());
  const { message, passcode } = event;

  if (passcode !== context.PASSCODE) {
    const response = new Twilio.Response();
    response.setStatusCode(401);
    response.setBody('Invalid passcode');
    return callback(null, response);
  }

  const isTesting = context.TESTMODE || true
  
  //let client = context.getTwilioClient();
  //let from = context.TWILIO_PHONE_NUMBER
  let client = require('twilio')(context.TEST_ACCOUNT_SID, context.TEST_AUTH_TOKEN);
  let from = '+15005550006'
  
  if( isTesting ) {
    client = require('twilio')(context.TEST_ACCOUNT_SID, context.TEST_AUTH_TOKEN);
    from = '+15005550006'
    console.log(`In Test Mode using ${from}`);
  } else {
    console.log(`*****!!!!!!!In PRODUCTION mode!!!!!!!*****`);
  }
  
  const allMessageRequests = phoneNumbers.map((to) => {
    return client.messages
      .create({
        from,
        to,
        body: message,
      })
      .then((msg) => {
        console.log(`Message sent [${msg.sid}] ${msg.from} ${msg.to}`);
        return { success: true, sid: msg.sid, to: msg.to};
      })
      .catch((err) => {
        //const toNumber = (err.code === 21211) ? err.message.split(' ')[3] : 'unknown'
        const numberList = err.message.match(/\+[0-9]+/g) || [];
        const toNumber = numberList.length > 0 ? numberList[0] : 'unknown'
        console.log(`Message failed for ${toNumber} [${err.code} ${err.message}]`);
        return { success: false, error: err.message, to: toNumber };
      });
  });

  Promise.all(allMessageRequests)
    .then((result) => {
      return callback(null, { result, requestId: event.requestId});
    })
    .catch((err) => {
      console.error(err);
      return callback('Failed to fetch messages');
    });
};
