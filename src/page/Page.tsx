import { AppShell, Button, Center, Group, TextInput } from "@mantine/core";

import {
  ApiKeyProvider,
  useGithubApiKey,
} from "../github-utils/ApikeyProvider";

const Page = () => {
  const apiKey = useGithubApiKey();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 0,
        breakpoint: 0,
      }}
      padding="md"
    >
      <AppShell.Header>
        <form>
          <Center>
            <Group gap={0}>
              <TextInput w={300} placeholder="Enter github username" />
              <Button>Search</Button>
            </Group>
          </Center>
        </form>
      </AppShell.Header>

      <AppShell.Main>Api key is {apiKey ?? "undefined"}</AppShell.Main>
    </AppShell>
  );
};

export default Page;
