import { AppShell, Button, Center, Group, TextInput } from "@mantine/core";

import { useGithubAccessToken } from "../github-utils/GHAccessTokenProvider";
import { Octokit } from "octokit";
import { useCallback, useEffect } from "react";

const Page = () => {
  const accessToken = useGithubAccessToken();

  const getUser = useCallback(async () => {
    try {
      const octokit = new Octokit({ auth: accessToken });
      const data = await octokit.rest.users.getAuthenticated();

      return data;
    } catch (error) {
      return {};
    }
  }, [accessToken]);

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

      <AppShell.Main>{JSON.stringify(getUser(), null, 4)}</AppShell.Main>
    </AppShell>
  );
};

export default Page;
