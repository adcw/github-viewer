import { AppShell, Button, Group, TextInput } from "@mantine/core";

import AuthUserInfo from "../components/AuthUserInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchedUserInfo from "../components/search-result/UserPage";
import UserModel from "../types/user_model";
import { useGithubAccessToken } from "../github-utils/GHAccessTokenProvider";
import { Octokit, RequestError } from "octokit";

const Page = () => {
  const accessToken = useGithubAccessToken();
  const searchInputRef = useRef<HTMLInputElement | undefined>(undefined);

  const [searchResult, setSearchResult] = useState<
    UserModel | undefined | null
  >(undefined);

  const handleSearch = async () => {
    const client = getClient();
    const searchString = searchInputRef.current.value;

    try {
      const res = await client.request(`GET /users/${searchString}`, {
        username: "USERNAME",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      console.log(res.data);
      setSearchResult(res.data);
    } catch (error) {
      // Not found
      if (error instanceof RequestError) {
        setSearchResult(null);
      } else throw error;
    }
  };

  const getClient = useCallback(() => {
    const client = new Octokit({ auth: accessToken });
    return client;
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
        <Group pt="sm" gap="md" grow>
          <AuthUserInfo />
          <Group gap={0}>
            <TextInput
              ref={searchInputRef}
              w={300}
              placeholder="Enter github username"
            />
            <Button onClick={handleSearch}>Search</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <SearchedUserInfo result={searchResult} getClient={getClient}/>
      </AppShell.Main>
    </AppShell>
  );
};

export default Page;
