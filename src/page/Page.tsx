import { AppShell, Button, Center, Group, TextInput } from "@mantine/core";

import {
    useGithubAccessToken
} from "../github-utils/GHAccessTokenProvider";

const Page = () => {
  const accessToken = useGithubAccessToken();
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

      <AppShell.Main>Access token is {accessToken ?? "undefined"}</AppShell.Main>
    </AppShell>
  );
};

export default Page;
