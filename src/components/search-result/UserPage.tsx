import {
  Anchor,
  Avatar,
  Card,
  Center,
  Divider,
  Group,
  Overlay,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useHover, useMediaQuery } from "@mantine/hooks";
import { IconAt } from "@tabler/icons-react";
import { Octokit } from "octokit";
import { useCallback, useEffect, useState } from "react";
import RepoModel from "../../types/repo_model";
import UserModel from "../../types/user_model";
import RepoTable from "./RepoElement";

export interface SearchedUserInfoProps {
  result: UserModel;
  getClient: () => Octokit;
}

const SearchedUserInfo = ({
  result: user,
  getClient,
}: SearchedUserInfoProps) => {
  const [repos, setRepos] = useState<RepoModel[] | undefined>(undefined);
  const { ref, hovered } = useHover();

  const getRepos = useCallback(async () => {
    if (user === undefined) return;

    const client = getClient() as Octokit;

    try {
      const res = await client.request(`GET ${user.repos_url}`);
      console.log(res.data);
      setRepos(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    setRepos(undefined);
    if (user === null) return;
    getRepos();
  }, [user?.id]);

  if (user === null) {
    return (
      <Group grow align="flex-center" py="xl">
        <Center>
          <Title c="dimmed" fs="italic" order={3}>
            User not found
          </Title>
        </Center>
      </Group>
    );
  }

  if (user === undefined) {
    return (
      <Group grow align="flex-center" py="xl">
        <Center>
          <Title c="dimmed" fs="italic" order={3}>
            Use the searchbar on the top to find github users by name
          </Title>
        </Center>
      </Group>
    );
  }

  return (
    <Group grow align="flex-start">
      <Card mih={400} maw="fit-content">
        <Stack w={250}>
          <Group wrap="nowrap" align="flex-start">
            <div ref={ref}>
              <Anchor href={user.html_url} target="_blank">
                <Avatar src={user.avatar_url} size={94} radius="md"/>
              </Anchor>
            </div>

            <Stack justify="flex-end" gap="xs">
              {user.name ? (
                <Group wrap="nowrap" gap={10} mt={3}>
                  <Text fz="xs" c="dimmed">
                    {user.name}
                  </Text>
                </Group>
              ) : (
                <></>
              )}

              <Text fz="lg" fw={500}>
                {user.login}
              </Text>

              {user.email ? (
                <Group wrap="nowrap" gap={10} mt={3}>
                  <IconAt stroke={1.5} size="1rem" />
                  <Text fz="xs" c="dimmed">
                    {user.email}
                  </Text>
                </Group>
              ) : (
                <></>
              )}
            </Stack>
          </Group>

          <Stack h={100} gap={0} align="stretch" justify="space-around">
            <Divider />
            {user.bio ? (
              <Text>{user.bio}</Text>
            ) : (
              <Text c="dimmed" fs="italic">
                No bio provided
              </Text>
            )}
            <Divider />
          </Stack>
        </Stack>
      </Card>
      <Group grow>
        {repos === undefined ? (
          <Stack gap={0}>
            {[0, 1, 2, 3, 4].map((v, k) => (
              <Skeleton key={k} height={60} mt={6} width="100%" />
            ))}
          </Stack>
        ) : (
          ""
        )}

        {repos !== undefined && repos.length > 0 ? (
          <Stack gap={0}>
            <Title order={4} mb="md">
              Repositories owned by the user:
            </Title>
            <RepoTable repos={repos} />
          </Stack>
        ) : (
          ""
        )}

        {repos !== undefined && repos.length === 0 ? (
          <Title order={4} c="dark.2">
            No repositories found.
          </Title>
        ) : (
          ""
        )}
      </Group>
    </Group>
  );
};

export default SearchedUserInfo;
