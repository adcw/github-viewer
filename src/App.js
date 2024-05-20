import { MantineProvider } from "@mantine/core";

import { GHAccessTokenProvider } from "./github-utils/GHAccessTokenProvider";
import Page from "./page/Page";

function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark", primaryColor: "yellow" }}
      defaultColorScheme="dark"
      withGlobalClasses
    >
      <GHAccessTokenProvider>
        <Page />
      </GHAccessTokenProvider>
    </MantineProvider>
  );
}

export default App;
