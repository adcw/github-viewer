import { AppShell, Button, Group, TextInput } from "@mantine/core";

import { Octokit, RequestError } from "octokit";
import { useCallback, useRef, useState } from "react";
import SearchedUserInfoComponent from "../components/search-result/SearchedUserInfoComponent";
import { useGithubAccessToken } from "../github-utils/GHAccessTokenProvider";
import UserModel from "../types/user_model";
import AuthUserInfo from "../components/user-info/AuthUserInfo";

const Page = () => {
  const { accessToken } = useGithubAccessToken();
  const searchInputRef = useRef<HTMLInputElement | undefined>(undefined);
  const [inputError, setInputError] = useState(null);

  const [searchResult, setSearchResult] = useState<
    UserModel | undefined | null
  >(undefined);

  const handleSearch = async () => {
    const searchString = searchInputRef.current.value;

    if (searchString.length < 1) {
      setInputError("Type at least a character.");
      return;
    }

    const client = getClient();

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
      }
    }
  };

  const getClient = useCallback(() => {
    const client = new Octokit({ auth: accessToken });
    return client;
  }, [accessToken]);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 0,
        breakpoint: 0,
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group pt={12} pb={18} gap="md" mx="xl" grow justify="space-between">
          <AuthUserInfo />
          <Group gap={0} justify="flex-end" align="flex-start">
            <TextInput
              error={inputError}
              minLength={1}
              ref={searchInputRef}
              w={300}
              placeholder="Enter github username"
              onChange={() => setInputError(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button onClick={handleSearch}>Search</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <SearchedUserInfoComponent
          result={searchResult}
          getClient={getClient}
        />
      </AppShell.Main>
    </AppShell>
  );
};

export default Page;
