// eslint-disable-next-line consistent-return
exports.handler = function (context, event, callback) {
  console.log("Context:", JSON.stringify(context, null, 2));
  console.log("Event:", JSON.stringify(event, null, 2));

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const { passcode } = event;

  // if (passcode !== context.PASSCODE) {
  //   response.setStatusCode(401);
  //   response.setBody({ status: "Invalid passcode" });
  //   return callback(null, response);
  // }

  let client = context.getTwilioClient();

  return client.messages
    .list({
      limit: 100,
    })
    .then((messages) => {
      let scheduled_messages = messages.filter(
        (msg) => msg.status == "scheduled"
      );
      response.setBody(scheduled_messages);
      return callback(null, response);
    })
    .catch((err) => {
      console.error(err);
      response.setStatusCode(500);
      response.setBody(err);
      return callback(null, response);
    });
};
