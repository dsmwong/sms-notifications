import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Box } from "@twilio-paste/core/box";

import {
  Heading,
  Paragraph,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from "@twilio-paste/core";

import dynamic from "next/dynamic";

const NewMessagePanel = dynamic(
  import("../components/NewMessagePanel").then((mod) => mod.default),
  { ssr: false }
); // disable ssr

const ExistingMessagePanel = dynamic(
  import("../components/ExistingMessagePanel").then((mod) => mod.default),
  { ssr: false }
); // disable ssr

const Anchor = dynamic(
  import("@twilio-paste/core/Anchor").then((mod) => mod.Anchor),
  { ssr: false }
); // disable ssr

const Home: NextPage = () => {
  const [tab, setTab] = React.useState("existing-tab");

  return (
    <>
      <Head>
        <title>SMS Notifications</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main" padding="space70">
        <Heading as={"h3"} variant={"heading10"}>
          Message Scheduler
        </Heading>
        <Paragraph>
          Add and remove scheduled messages for your account, messages may be
          scheduled <strong> 15 mins from now, up to 7 days in advance.</strong>
        </Paragraph>
        <Paragraph>
          Please read the{" "}
          <Anchor
            href="https://support.twilio.com/hc/en-us/articles/4412165297947-Message-Scheduling-FAQs-and-Limitations"
            showExternal
          >
            Scheduling FAQs and Limitations
          </Anchor>{" "}
          to find out more about scheduling constraints and account
          configuration
        </Paragraph>

        <Tabs selectedId={tab} baseId="horizontal-tabs-example">
          <TabList aria-label="New and existing messages">
            <Tab id="new-tab">Add Messages</Tab>
            <Tab id="existing-tab">Scheduled Messages</Tab>
          </TabList>
          <TabPanels>
            <NewMessagePanel tabId="new-tab" />
            <ExistingMessagePanel tabId="existing-tab" />
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Home;
