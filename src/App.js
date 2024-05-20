import { MantineProvider } from "@mantine/core";

import { ApiKeyProvider } from "./github-utils/ApikeyProvider";
import Page from "./page/Page";

function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      defaultColorScheme="dark"
      withGlobalClasses
    >
      <ApiKeyProvider>
        <Page />
      </ApiKeyProvider>
    </MantineProvider>
  );
}

export default App;
