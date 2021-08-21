const recipientForm = document.getElementById('recipientForm');
const sendNotificationForm = document.getElementById('sendNotificationForm');
const newRecipientInput = document.getElementById('newRecipientInput');
const recipientList = document.getElementById('recipients');
const resultSection = document.getElementById('resultSection');
const uploadButton = document.getElementById('uploadCSV');

const recipients = [];

function addRecipient(phoneNumber) {
  recipients.push(phoneNumber);
  const newListItem = document.createElement('li');
  newListItem.innerText = phoneNumber;
  newListItem.id= `id_${phoneNumber.replace('+', '')}`;
  recipientList.appendChild(newListItem);
}

function clearForm(form) {
  // only clearing the passcode and leaving the message for convience
  form.passcode.value = '';
}

recipientForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (newRecipientInput.value) {
    addRecipient(newRecipientInput.value);
    newRecipientInput.value = '';
  }
});

const fileSelector = document.getElementById('csvFile');
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  parseCSV(fileList[0]);

});

const messageBox = document.getElementById('messageInput');
const segmentCountMessage = document.getElementById('segmentCountMessage');
messageBox.addEventListener('input', (evt) => {
  if (messageBox.value.length > 0) {
    let segmentCount = 1
    const [maxCharInMessage, maxCharInSegment] = (/[^\u0000-\u00ff]/.test(messageBox.value)) ? [70, 67] : [160, 153];
    if( messageBox.value.length > maxCharInMessage ) {
      // https://www.twilio.com/docs/glossary/what-sms-character-limit
      segmentCount = Math.ceil(messageBox.value.length / maxCharInSegment);
    }
    segmentCountMessage.innerText = `${messageBox.value.length} characters in message, this is ${segmentCount} segements`;
    segmentCountMessage.innerText += (maxCharInMessage == 70 ) ? ' and Unicode Detected' : '';
  } else {
    segmentCountMessage.innerText = '';
  }
});

function parseCSV(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const numberlist = event.target.result.split('\n');
    numberlist.forEach((number) => {
      addRecipient(number);
    });
  });
  reader.readAsText(file);
}

const viewFilter = document.viewResultFilter.viewFilters;
viewFilter.forEach((selection) => {
  selection.addEventListener('click', (evt) => {
    document.querySelectorAll('ul#recipients li').forEach(item => item.classList.remove('hide'));
    switch (evt.target.value) {
      case 'failure':
        document.querySelectorAll('ul#recipients li.success').forEach(item => item.classList.add('hide'));
        break;
      case 'success':
        document.querySelectorAll('ul#recipients li.failed').forEach(item => item.classList.add('hide'));
        break;
    }
  })
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessages(form) {
  
  const MAXSEND = 20;
  let sent = [];

  while( recipients.length > 0 && sent.length < recipients.length ) {

    const batch = recipients.slice(sent.length, sent.length + MAXSEND);
    const data = {
      passcode: form.passcode.value,
      message: form.message.value,
      recipients: batch.join(','),
      requestId: sent.length
    };
    sent = [ ...sent, ...batch ];

    console.log(`Sending request ${data.requestId} -- ${data.recipients}`);

    fetch('send-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }

      if (resp.status === 401) {
        throw new Error('Invalid Passcode');
      } else {
        throw new Error(
          'Unexpected error. Please check the logs for what went wrong.'
        );
      }
    })
    .then((body) => {
      const successCount = body.result.reduce((currentCount, resultItem) => {
        return resultItem.success ? currentCount + 1 : currentCount;
      }, 0);

      console.log(`Request ${body.requestId} -- ${successCount} of ${body.result.length}`);

      body.result.map( item => {
        const to = item.to;
        const elem = document.getElementById('id_' + to.replace('+', ''));
        if (elem) {
          elem.className = item.success ? 'success' : 'failed';
          if( item.success ) {
            elem.textContent += ' Message SID: ' + item.sid;
          } else {
            elem.textContent += ' Error: ' + item.error;
          }
        } else {
          console.error(`${body.requestId} Could not find element for ${to} Error Message: ${item.error}`);
        }
      });

      //resultSection.innerText = `Sent ${successCount} of ${body.result.length} messages. Check logs for details`;
    })
    .catch((err) => {
      console.error(err);
      //resultSection.innerText = err.message;
    });    

    if( (sent.length % 100) < MAXSEND) {
      console.log(`Sent ${sent.length} messages - throttling`);
      await sleep(1000);
    }

  }
  clearForm(form);
  console.log('Sending to ' + sent.length + ' recipients');
}

sendNotificationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (recipients.length === 0 && newRecipientInput.value) {
    addRecipient(newRecipientInput.value);
    newRecipientInput.value = '';
  }

  if (recipients.length === 0) {
    resultSection.innerText = 'Please enter at least one phone number';
  } else {
    resultSection.innerText = 'Sending messages. One moment';
    sendMessages(evt.target);
  }
});
