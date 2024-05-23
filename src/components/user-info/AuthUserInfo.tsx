import { Anchor, Group, Text } from "@mantine/core";

import { Octokit } from "octokit";
import { useCallback, useEffect, useState } from "react";
import { useGithubAccessToken } from "../../github-utils/GHAccessTokenProvider";

const AuthUserInfo = () => {
  const { accessToken, openModal } = useGithubAccessToken();

  const [userData, setUserData] = useState(undefined);

  const getUser = useCallback(
    async (at: string) => {
      try {
        const octokit = new Octokit({ auth: at });
        const res = await octokit.rest.users.getAuthenticated();

        setUserData(res.data);
      } catch (error) {
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
      <Anchor onClick={openModal}>{userData?.login}</Anchor>
    </Group>
  );
};

export default AuthUserInfo;
