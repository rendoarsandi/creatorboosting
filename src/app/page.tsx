'use client';

import { useStatsigClient } from "@statsig/react-bindings";

export default function Home() {
  const { client } = useStatsigClient();

  return <button onClick={() => client.logEvent("my_custom_event")}> Click Me </button>;

}