// eslint-disable-next-line consistent-return
exports.handler = function (context, event, callback) {
  console.log("Context:", JSON.stringify(context, null, 2));
  console.log("Event:", JSON.stringify(event, null, 2));

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const { passcode, sid } = event;

  // if (passcode !== context.PASSCODE) {
  //   response.setStatusCode(401);
  //   response.setBody({ status: "Invalid passcode" });
  //   return callback(null, response);
  // }

  if (!sid) {
    response.setStatusCode(401);
    response.setBody({ status: "Missing message SID" });
    return callback(null, response);
  }

  let client = context.getTwilioClient();

  return client
    .messages(sid)
    .update({ status: "canceled" })
    .then((messages) => {
      response.setBody({ status: "canceled", success: true });
      return callback(null, response);
    })
    .catch((err) => {
      console.error(err);
      response.setStatusCode(500);
      response.setBody(err);
      return callback(null, response);
    });
};
