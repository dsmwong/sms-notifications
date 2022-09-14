// eslint-disable-next-line consistent-return
exports.handler = function (context, event, callback) {
  console.log("Context:", JSON.stringify(context, null, 2));
  console.log("Event:", JSON.stringify(event, null, 2));

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const { recipients, passcode } = event;

  // if (passcode !== context.PASSCODE) {
  //   response.setStatusCode(401);
  //   response.setBody({ status: "Invalid passcode" });
  //   return callback(null, response);
  // }

  const isTesting =
    context.TESTMODE !== undefined ? context.TESTMODE == "true" : true;
  console.log(
    `Is test Mode context.TESTMODE = ${context.TESTMODE}, isTesting func: ${isTesting}`
  );

  let client = context.getTwilioClient();
  let from = context.TWILIO_PHONE_NUMBER;

  if (isTesting) {
    client = require("twilio")(
      context.TEST_ACCOUNT_SID,
      context.TEST_AUTH_TOKEN
    );
    from = context.TEST_TWILIO_PHONE_NUMBER;
    console.log(`In Test Mode using ${from}`);
  } else {
    console.log(`*****!!!!!!!In PRODUCTION mode!!!!!!!*****`);
  }

  const allMessageRequests = recipients.map((recipient) => {
    let msgBody = recipient.message;

    // If we have replaceable parameters
    if (recipient.parameters) {
      recipient.parameters.filter((param, idx) => {
        msgBody = msgBody.replace(`{${idx}}`, param);
      });
    }
    console.log(
      `Sending message from ${from} to ${recipient.phone} with body ${msgBody}`
    );

    return client.messages
      .create({
        messagingServiceSid: context.MESSAGE_SERVICE_SID,
        from,
        to: recipient.phone,
        body: msgBody,
        scheduleType: "fixed",
        sendAt: recipient.sendAt,
      })
      .then((msg) => {
        console.log(
          `Message sent [${msg.sid}] ${msg.from} ${msg.to} with message ${msg.body}`
        );
        return {
          success: true,
          cid: recipient.cid,
          sid: msg.sid,
          to: msg.to,
          body: msg.body,
        };
      })
      .catch((err) => {
        //const toNumber = (err.code === 21211) ? err.message.split(' ')[3] : 'unknown'
        const numberList = err.message.match(/\+[0-9]+/g) || [];
        const toNumber = numberList.length > 0 ? numberList[0] : "unknown";
        console.log(
          `Message failed for ${toNumber} or ${recipient.phone} [${err.code} ${err.message}]`
        );
        return { success: false, cid: recipient.cid, error: err.message };
      });
  });

  Promise.all(allMessageRequests)
    .then((result) => {
      console.log("Result: ", JSON.stringify(result, null, 2));
      response.setBody(result);
      return callback(null, response);
    })
    .catch((err) => {
      console.error(err);
      response.setStatusCode(500);
      response.setBody(err);
      return callback(null, response);
    });
};
