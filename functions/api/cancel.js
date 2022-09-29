// eslint-disable-next-line consistent-return
exports.handler = function (context, event, callback) {
  console.log("Context:", JSON.stringify(context, null, 2));
  console.log("Event:", JSON.stringify(event, null, 2));

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const { passcode, sids } = event;

  // if (passcode !== context.PASSCODE) {
  //   response.setStatusCode(401);
  //   response.setBody({ status: "Invalid passcode" });
  //   return callback(null, response);
  // }

  if (!sids || !Array.isArray(sids)) {
    response.setStatusCode(400);
    response.setBody({ status: "Missing sids array" });
    return callback(null, response);
  }

  let client = context.getTwilioClient();

  const allCancelRequests = sids.map((sid) => {
    console.log(`Canceling message ${sid}`);
    return client
      .messages(sids)
      .update({ status: "canceled" })
      .then((messages) => {
        return { success: true, sid: sid };
      })
      .catch((err) => {
        console.error(err);
        return { success: false, sid: sid, error: err.message };
      });
  });

  Promise.all(allCancelRequests)
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
