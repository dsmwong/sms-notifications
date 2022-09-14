export type MessageFormat = {
  cid?: number;
  phone: string;
  message: string;
  sendAt: Date;
};

export type ScheduleMessagesResponse = {
  status: string;
};

export const TableHeaderData = [
  "Phone",
  "Message",
  "Scheduled Date Time (Local)",
];

export const ExistingMessagesTableHeaderData = [
  "SID",
  "To",
  "Message",
  "Creation Date Time (Local)",
  "Segments",
];

export const TableBodyData = [
  ["+61467601932", "A message to be delivered via SMS", "ASAP", "ASAP"],
  [
    "+61467601932",
    "A message to be delivered via SMS, this one is really long and should take a while to read. No really, spend more than a few seconds reading this message, it contains an example web page too http://www.example.com",
    "ASAP",
    "ASAP",
  ],
  [
    "+61467601932",
    "A message to be delivered via SMS, this one is really long and should take a while to read. No really, spend more than a few seconds reading this message, it contains an example web page too http://www.example.com. Oh did I mention that there is the ability to do 💥 Unicode characters too! 😇😻🫶, please enjoy this 🐥",
    "ASAP",
    "ASAP",
  ],
  [
    "+61467601931",
    "A message to be delivered via SMS, this one is really long and should take a while to read. No really, spend more than a few seconds reading this message, it contains an example web page too http://www.example.com. Oh did I mention that there is the ability to do 💥 Unicode characters too! 😇😻🫶, please enjoy this 🐥",
    "ASAP",
    "ASAP",
  ],
];
