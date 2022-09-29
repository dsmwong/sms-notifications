import {
  TabPanel,
  Button,
  Stack,
  Card,
  CalloutHeading,
  CalloutText,
  Heading,
  Spinner,
  Box,
  Paragraph,
} from "@twilio-paste/core";
import LoadingDataGrid from "../LoadingDataGrid";
import dynamic from "next/dynamic";
import { useState } from "react";
import axios from "axios";
import {
  ExistingMessagesTableHeaderData,
  MessageFormat,
  TableHeaderData,
} from "../../util/constants";
import React from "react";

const Callout = dynamic(
  import("@twilio-paste/core").then((mod) => mod.Callout),
  { ssr: false }
); // disable ssr

const PaginatedDataGrid = dynamic(
  import("../PaginatedDataGrid").then((mod) => mod.default),
  { ssr: false }
); // disable ssr

const MinusIcon = dynamic(
  import("@twilio-paste/icons/cjs/MinusIcon").then((mod) => mod.MinusIcon),
  { ssr: false }
); // disable ssr

const ClearIcon = dynamic(
  import("@twilio-paste/icons/cjs/ClearIcon").then((mod) => mod.ClearIcon),
  { ssr: false }
); // disable ssr

const LoadingIcon = dynamic(
  import("@twilio-paste/icons/cjs/LoadingIcon").then((mod) => mod.LoadingIcon),
  { ssr: false }
); // disable ssr

export interface ExistingMessagePanel {
  tabId: string;
}

const ExistingMessagePanel: React.FC<
  ExistingMessagePanel & React.RefAttributes<HTMLDivElement>
> = (props: ExistingMessagePanel) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const [data, setData] = useState<string[][]>([]);

  const [anyItemsChecked, setAnyItemsChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

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

  const handleRefresh = async () => {
    setLoading(true);
    setRefreshing(true);
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    console.log("Requesting message list");
    let records = [];

    await axios
      .post(BASE_URL + "/api/list")
      .then((response) => {
        console.log("API response", response);

        response.data.map((item, idx) => {
          let record = [];
          record[0] = item.sid;
          record[1] = item.to;
          record[2] = item.body;
          record[3] = new Date(item.dateCreated).toLocaleString();
          record[4] = item.numSegments;

          records.push(record);
        });
      })
      .finally(() => {
        setData(records);
        setLoading(false);
        setRefreshing(false);
        console.log("End of API request");
      });
  };

  // Remove messages
  const handleUnscheduleMessages = async () => {
    console.log("Un-scheduling messages");
    setLoading(true);
    setRefreshing(true);

    let sids: string[] = [];
    checkedItems.map((isChecked, idx) => {
      if (isChecked == true) {
        sids.push(data[idx][0]);
      }
    });

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    console.log("Posting messages to API", JSON.stringify(sids, null, 2));

    await axios
      .post(BASE_URL + "/api/cancel", { sids: sids })
      .then((response) => {
        console.log("API response", response);
      })
      .finally(() => {
        handleRefresh();
      });
  };

  return (
    <TabPanel id={props.tabId}>
      <Card>
        <Heading variant="heading30" as={"h2"}>
          Scheduled Messages
        </Heading>

        {loading && (
          <Box marginBottom={"space40"} marginTop={"space40"}>
            {" "}
            <LoadingDataGrid headers={ExistingMessagesTableHeaderData} />
          </Box>
        )}

        {!loading && data && data.length > 0 && (
          <>
            <Callout variant="success">
              <CalloutHeading as="h6">Scheduled Messages</CalloutHeading>
              <CalloutText>
                Messages in this list are scheduled for delivery. Choose one or
                more messages to cancel, or removed all of them at once.
              </CalloutText>
            </Callout>

            <PaginatedDataGrid
              headers={ExistingMessagesTableHeaderData}
              data={data}
              handleCheckedItems={handleCheckedItems}
            />
          </>
        )}

        {(!loading && !data) ||
          (data.length == 0 && <Paragraph>No data to display</Paragraph>)}

        <Stack orientation="horizontal" spacing="space30">
          <Button
            as="button"
            variant="primary"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            {refreshing && (
              <Spinner decorative={false} title="Saving" size="sizeIcon20" />
            )}
            {!refreshing && (
              <LoadingIcon
                decorative={false}
                size="sizeIcon10"
                title="Refresh"
              />
            )}
            Refresh
          </Button>
          <Button
            as="button"
            variant="destructive"
            disabled={!anyItemsChecked || refreshing || loading}
            onClick={handleUnscheduleMessages}
          >
            <MinusIcon
              decorative={false}
              size="sizeIcon10"
              title="Clear all messages"
            />
            Unschedule and Delete
          </Button>
        </Stack>
      </Card>
    </TabPanel>
  );
};

export default ExistingMessagePanel;
