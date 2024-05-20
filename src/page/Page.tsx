import {
  AppShell,
  Button,
  Center,
  Group,
  TextInput,
  Text,
  Container,
} from "@mantine/core";

import { useGithubAccessToken } from "../github-utils/GHAccessTokenProvider";
import { Octokit } from "octokit";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const accessToken = useGithubAccessToken();

  const [userData, setUserData] = useState(undefined);

  const getUser = useCallback(
    async (at: string) => {
      try {
        const octokit = new Octokit({ auth: at });
        const res = await octokit.rest.users.getAuthenticated();

        setUserData(res.data);
      } catch (error) {
        console.log("ERR\n" + error);
        return {};
      }
    },
    [accessToken]
  );

  useEffect(() => {
    getUser(accessToken);
  }, [accessToken, getUser]);

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
        <Group pt="sm" gap="md" grow>
          <Group gap={4}>
            <Text>Authenticated as</Text>
            <Text color="yellow">{userData?.login}</Text>
          </Group>
          <Group gap={0}>
            <TextInput w={300} placeholder="Enter github username" />
            <Button>Search</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main></AppShell.Main>
    </AppShell>
  );
};

export default Page;
