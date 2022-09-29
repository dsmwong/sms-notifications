import React, { useEffect, useState } from "react";

import {
  Label,
  Input,
  Card,
  Box,
  Heading,
  Paragraph,
  Button,
  Spinner,
  DatePicker,
  TimePicker,
  TextArea,
  Stack,
  HelpText,
} from "@twilio-paste/core";

// import dynamic from "next/dynamic";
import { MessageFormat } from "../../util/constants";
import { UploadIcon } from "@twilio-paste/icons/cjs/UploadIcon";

interface MessageInputProps {
  handleAddMessageBulk: any;
  handleAddMessage: any;
  saving: boolean;
}

const MessageInput: React.FC<MessageInputProps> = (
  props: MessageInputProps
) => {
  const [message, setMessage] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [sendDate, setSendDate] = React.useState<string>("");
  const [sendTime, setSendTime] = React.useState<string>("");

  const [valid_phone, setValidPhone] = React.useState<boolean>(false);
  const [valid_message, setValidMessage] = React.useState<boolean>(false);
  const [valid_date, setValidDate] = React.useState<boolean>(false);
  const [valid_time, setValidTime] = React.useState<boolean>(false);

  const [canAddMessage, setCanAddMessage] = useState(false);

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const hiddenFileInput = React.useRef(null);

  const validateInputs = () => {
    setValidPhone(true);
    setValidMessage(true);
    setValidDate(true);
    setValidTime(true);

    // Validate phone
    if (phone === "") setValidPhone(false);
    if (phone?.indexOf(" ") > -1) setValidPhone(false);

    // Validate message
    if (message === "") setValidMessage(false);

    // Validate date
    if (sendDate === "") setValidDate(false);

    // Validate time
    if (sendTime === "") setValidTime(false);

    try {
      let proposedDate: Date = new Date(sendDate + " " + sendTime);

      let ONE_MINUTE = 60 * 1000; /* ms */
      let FIFTEEN_MINUTES = ONE_MINUTE * 15;
      let ONE_HOUR = ONE_MINUTE * 60;
      let SEVEN_DAYS = ONE_HOUR * 24 * 7;

      const fifteenMinutesFromNow = new Date(Date.now() + FIFTEEN_MINUTES);
      const aWeekFromNow = new Date(Date.now() + SEVEN_DAYS);

      if (proposedDate < fifteenMinutesFromNow) setValidTime(false);
      if (proposedDate > aWeekFromNow) setValidTime(false);
    } catch (err) {
      console.log("Proposed date/time not valid");
      setValidTime(false);
    }

    let valid = valid_phone && valid_message && valid_date && valid_time;
    setCanAddMessage(valid);
    return valid;
  };

  useEffect(() => {
    validateInputs();
  }, [phone, message, sendDate, sendTime]);

  useEffect(
    () =>
      setCanAddMessage(
        valid_phone && valid_message && valid_date && valid_time
      ),
    [valid_phone, valid_message, valid_date, valid_time]
  );

  // File parser
  const parseCSV = (file) => {
    console.log("Parsing file");
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
      console.log("File loaded");
      let messages: MessageFormat[] = [];
      const csvLines = (event.target.result as string).split("\n");
      console.log("File lines", csvLines);
      csvLines.forEach((row) => {
        const values = row.split(",");
        let msg: MessageFormat = {
          phone: values[0],
          message: values[1],
          sendAt: new Date(values[2]),
        };
        messages.push(msg);
      });
      props.handleAddMessageBulk(messages);
    });

    reader.readAsText(file);
  };

  useEffect(() => {
    console.log("Selected file", selectedFile);
    if (selectedFile) parseCSV(selectedFile);
  }, [selectedFile]);

  // Programmatically click the hidden file input element
  // when the Button component is clicked
  const handleFileSelected = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleFileChooser = (event: any) => {
    hiddenFileInput.current.click();
  };

  const handleAddMessage = () => {
    let messageData: MessageFormat = {
      phone: phone,
      message: message,
      sendAt: new Date(sendDate + " " + sendTime),
    };

    if (validateInputs()) props.handleAddMessage(messageData);
  };

  return (
    <div>
      <Card>
        <Heading as="h2" variant="heading30">
          Add scheduled message
        </Heading>
        <Paragraph>
          Enter the message and phone number you wish to send a message to and
          select a time to deliver the message.
          <strong>
            {" "}
            Note that it must be more than 15 minutes and less than 7 days from
            now.
          </strong>
        </Paragraph>

        <Box marginBottom="space80">
          <Label htmlFor="phone" required>
            Phone number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="E.164 Phone number, e.g. +61414123456"
            required={true}
            defaultValue={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {!valid_phone && (
            <HelpText id="phone_error" variant="error">
              Enter a valid phone number, using E.164 format (e.g.
              +61414123456).
            </HelpText>
          )}
        </Box>
        <Box marginBottom="space80">
          <Label htmlFor="message" required>
            Message
          </Label>
          <TextArea
            placeholder="A message to send as an SMS"
            aria-describedby="message"
            id="message"
            name="message"
            required
            onChange={(event) => setMessage(event.target.value)}
          />
          {!valid_message && (
            <HelpText id="message_error" variant="error">
              Enter text message to send to the phone number above
            </HelpText>
          )}
        </Box>
        <Box marginBottom="space80">
          <Label htmlFor="sendDate" required>
            Send date
          </Label>
          <DatePicker
            required
            id="sendDate"
            defaultValue={sendDate}
            onChange={(event) => setSendDate(event.target.value)}
            aria-describedby="sendDate"
          />
          {!valid_date && (
            <HelpText id="date_error" variant="error">
              Enter a valid date
            </HelpText>
          )}
        </Box>
        <Box marginBottom="space80">
          <Label htmlFor="sendTime" required>
            Send time
          </Label>
          <TimePicker
            required
            id="sendTime"
            defaultValue={sendTime}
            onChange={(event) => setSendTime(event.target.value)}
            aria-describedby="sendTime"
          />
          {!valid_time && (
            <HelpText id="time_error" variant="error">
              Enter a valid time, more than 15 minutes and less than 7 days from
              now
            </HelpText>
          )}
        </Box>

        <Stack orientation="horizontal" spacing="space30">
          <Button
            variant="primary"
            onClick={handleAddMessage}
            disabled={!canAddMessage || props.saving}
          >
            {props.saving && (
              <Spinner decorative={false} title="Saving" size="sizeIcon20" />
            )}{" "}
            Add message
          </Button>

          <Button
            as="button"
            variant="secondary"
            onClick={handleFileChooser}
            disabled={true && props.saving}
          >
            <UploadIcon decorative />
            Import from .CSV
          </Button>

          <input
            type="file"
            name="file"
            ref={hiddenFileInput}
            onChange={handleFileSelected}
            style={{ display: "none" }}
          />
        </Stack>
      </Card>
    </div>
  );
};

export default MessageInput;
