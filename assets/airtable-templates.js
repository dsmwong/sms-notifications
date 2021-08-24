const templateSelect = document.getElementById('templateSelect');

let templates = {};

const url = `${window.location.protocol}//${window.location.host}/fetch-templates`;

fetch(url)
  .then(response => response.json())
  .then(json => {
    templates = json.body;

    Object.keys(templates).map((key) => {
      const option = document.createElement('option');
      option.text = key;
      option.value = key;
      templateSelect.add(option);
    })
    
  }).catch(err => {
    console.error(err);
  });

templateSelect.onchange = (e) => {
  
  const messageBox = document.getElementById('messageInput');

  if( e.target.value === 'none' ) { 
    messageBox.value = '';
  } else {
    messageBox.value = templates[e.target.value];
    console.log(e.target.value + ' ' + templates[e.target.value]);
  }

  messageBox.dispatchEvent(new Event('input',{}));
}