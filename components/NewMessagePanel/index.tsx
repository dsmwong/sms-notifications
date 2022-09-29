import {
  TabPanel,
  Button,
  Stack,
  Card,
  Heading,
  Callout,
  CalloutHeading,
  CalloutText,
  Box,
  Paragraph,
  useToaster,
  Toaster,
} from "@twilio-paste/core";

import LoadingDataGrid from "../LoadingDataGrid";
import { useState } from "react";
import React from "react";
import MessageInput from "../MessageInput";
import {
  ExistingMessagesTableHeaderData,
  MessageFormat,
  TableHeaderData,
} from "../../util/constants";
import PaginatedDataGrid from "../PaginatedDataGrid";
import { MinusIcon } from "@twilio-paste/icons/cjs/MinusIcon";

import axios from "axios";

export interface NewMessagePanelProps {
  tabId: string;
}

const NewMessagePanel: React.FC<
  NewMessagePanelProps & React.RefAttributes<HTMLDivElement>
> = (props: NewMessagePanelProps) => {
  const toaster = useToaster();

  const [saving, setSaving] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[][]>([]);

  const reloadTable = () => {
    setSaving(true);
    setLoading(true);

    setTimeout(() => {
      setSaving(false);
      setLoading(false);
    }, 500);
  };

  const handleAddMessageBulk = (messages: MessageFormat[]) => {
    console.log("Add new messages", messages);

    const newData = data;

    messages.map((message) => {
      let record = [];
      record[0] = message.phone;
      record[1] = message.message;
      record[2] = message.sendAt.toString();
      // record[2] = messageData.sendAt.toDateString();
      // record[3] = messageData.sendAt.toTimeString();
      newData.push(record);
    });

    setData(data);
    reloadTable();
  };

  const handleAddMessage = (message: MessageFormat) => {
    console.log("Add new message", message);
    handleAddMessageBulk([message]);
  };

  const [anyItemsChecked, setAnyItemsChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  // Table new items checked
  const handleCheckedItems = (items) => {
    console.log("We have checked items: ", items);
    setCheckedItems(items);
    let haveChecked: boolean = false;

    checkedItems.map((isChecked, idx) => {
      console.log(` Checking items idx ${idx} it is: ${isChecked}`);
      if (isChecked == true) haveChecked = true;
    });

    console.log(`Any item checked: ${haveChecked}`);
    setAnyItemsChecked(haveChecked);
  };

  // Remove messages from table
  const handleClearSelected = () => {
    console.log("Clearing selected items");
    const newData = [];

    checkedItems.map((isChecked, idx) => {
      if (isChecked == false) newData.push(data[idx]);
      setData(newData);
    });
    setAnyItemsChecked(false);
    reloadTable();
  };

  // Send messages to API
  const handleScheduleMessages = async () => {
    console.log("Scheduling messages");
    setSaving(true);

    let newData = data;
    let messages: MessageFormat[] = [];

    checkedItems.map((isChecked, idx) => {
      if (isChecked == true) {
        // Add to array to send to API
        let msg: MessageFormat = {
          cid: idx,
          phone: data[idx][0],
          message: data[idx][1],
          sendAt: new Date(data[idx][2]),
        };
        messages.push(msg);
      }
    });

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    console.log("Posting messages to API", JSON.stringify(messages, null, 2));

    await axios
      .post(BASE_URL + "/api/schedule", { recipients: messages })
      .then((response) => {
        console.log("API response", response);

        let anyErrors = false;
        let anySuccess = false;

        if (response.data) {
          // Check for unacceptable messages
          response.data.map((item, idx) => {
            console.log("Checking item for scheduling success", item);
            anyErrors = anyErrors || !item.success;
            anySuccess = anySuccess || item.success;

            if (item.success) {
              delete newData[item.cid];
            }
          });
        }

        // Check for all errors
        if (anyErrors && !anySuccess) {
          toaster.push({
            message: "No Messages scheduled, check logs for details",
            variant: "error",
          });
        }

        // Check for partial success/partial error
        if (anyErrors && anySuccess) {
          toaster.push({
            message: "Some messages scheduled, some failed, check logs",
            variant: "warning",
          });
        }

        // Check for all successful
        if (!anyErrors && anySuccess) {
          toaster.push({
            message: "Messages scheduled, check other tab for details",
            variant: "success",
          });
        }
      })
      .catch((err) => {
        console.log("Ahh, something borked", err);

        // Display error to user
        toaster.push({
          message: "Could not schedule messages, check log for details",
          variant: "error",
        });
      })
      .finally(() => {
        console.log("API request finished");
        setData(newData);
        setAnyItemsChecked(false);
        reloadTable();
      });
  };

  return (
    <TabPanel id={props.tabId}>
      <Stack orientation={"vertical"} spacing={"space60"}>
        <MessageInput
          handleAddMessageBulk={handleAddMessageBulk}
          handleAddMessage={handleAddMessage}
          saving={saving}
        />
        <Card>
          <Heading variant="heading30" as={"h2"}>
            New messages to be scheduled
          </Heading>

          {loading && (
            <Box marginBottom={"space40"} marginTop={"space40"}>
              {" "}
              <LoadingDataGrid headers={TableHeaderData} />
            </Box>
          )}

          {!loading && data && data.length > 0 && (
            <>
              <Callout variant="warning">
                <CalloutHeading as="h6">
                  Messages not yet scheduled!
                </CalloutHeading>
                <CalloutText>
                  Messages in this list have not yet been scheduled until you
                  press the <strong>Schedule Selected Messages</strong> button
                  below. Once the messages are scheduled, they will appear in
                  the <strong>Scheduled Messages</strong> tab above
                </CalloutText>
              </Callout>

              <PaginatedDataGrid
                headers={TableHeaderData}
                data={data}
                handleCheckedItems={handleCheckedItems}
              />
            </>
          )}

          {(!loading && !data) ||
            (data.length == 0 && <Paragraph>No data to display</Paragraph>)}

          <Box marginTop={"space40"}>
            <Stack orientation="horizontal" spacing="space30">
              <Button
                as="button"
                variant="primary"
                disabled={anyItemsChecked !== true || loading || saving}
                onClick={handleScheduleMessages}
              >
                Schedule Selected Messages
              </Button>
              <Button
                as="button"
                variant="destructive_secondary"
                onClick={handleClearSelected}
                disabled={anyItemsChecked !== true || loading || saving}
              >
                <MinusIcon
                  decorative={false}
                  size="sizeIcon10"
                  title="Clear Selected"
                />
                Clear selected
              </Button>
            </Stack>
          </Box>
        </Card>
      </Stack>
      <Toaster {...toaster} />
    </TabPanel>
  );
};

export default NewMessagePanel;
