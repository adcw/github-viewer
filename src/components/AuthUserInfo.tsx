import { Group, Text } from "@mantine/core";

import { Octokit } from "octokit";
import { useCallback, useEffect, useState } from "react";
import { useGithubAccessToken } from "../github-utils/GHAccessTokenProvider";

const AuthUserInfo = () => {
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
    <Group gap={4}>
      <Text>Authenticated as</Text>
      <Text color="yellow">{userData?.login}</Text>
    </Group>
  );
};

export default AuthUserInfo;
