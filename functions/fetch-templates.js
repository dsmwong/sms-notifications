const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const response = new Twilio.Response();
  response.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS POST GET',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  const client = context.getTwilioClient();
  client.httpClient.request({
    method: 'POST',
    uri: 'https://surveysubmission-9184-dev.twil.io/webinar/get-templates',
  }).then(respJSON => {
    
    console.log(`${context.PATH} ${response.statusCode}`);
    response.setBody(respJSON);
    return callback(null, response);
    
  }).catch( (e) => {
    return callback(e);
  });

};

