import {
  Anchor,
  Avatar,
  Card,
  Center,
  Divider,
  Group,
  ScrollArea,
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
import TotalRepoStatistics from "../../types/total_repo_statistics";
import DateText from "../dates/DateText";

export interface SearchedUserInfoComponentProps {
  result: UserModel;
  getClient: () => Octokit;
}

const SearchedUserInfoComponent = ({
  result: user,
  getClient,
}: SearchedUserInfoComponentProps) => {
  const [repos, setRepos] = useState<RepoModel[] | undefined>(undefined);
  const [totalStatistics, setTotalStatistics] = useState<
    TotalRepoStatistics | undefined
  >(undefined);

  const getRepos = useCallback(async () => {
    if (user === undefined) return;

    const client = getClient() as Octokit;

    try {
      const res = await client.request(`GET ${user.repos_url}`);
      // console.log(res.data);
      setRepos(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (repos)
      setTotalStatistics({
        total_stars: repos.reduce(
          (prev, curr) => prev + curr.stargazers_count,
          0
        ),
      });
  }, [repos]);

  useEffect(() => {
    setRepos(undefined);
    setTotalStatistics(undefined);
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
        <Stack w={300}>
          <Group wrap="nowrap" align="flex-start">
            <div>
              <Anchor href={user.html_url} target="_blank">
                <Avatar src={user.avatar_url} size={94} radius="md" />
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

              <Stack gap={0}>
                <Text fz="xs" c="dimmed" fw={500}>
                  Created at
                </Text>
                <DateText
                  fz="xs"
                  c="dimmed"
                  fw={500}
                  date_string={user.created_at}
                />
              </Stack>

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

          <Stack h={150} gap={0} align="stretch" justify="space-around">
            <Divider />
            {user.bio ? (
              <ScrollArea>
                <Text>{user.bio}</Text>
              </ScrollArea>
            ) : (
              <Text c="dimmed" fs="italic">
                No bio provided
              </Text>
            )}
            <Divider />
          </Stack>

          <Stack gap={8}>
            <Group justify="space-between">
              <Text>Total stars:</Text>
              <Text c="yellow">{totalStatistics?.total_stars}</Text>
            </Group>
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
          <Center>
            <Title order={3} c="dark.2">
              No repositories found.
            </Title>
          </Center>
        ) : (
          ""
        )}
      </Group>
    </Group>
  );
};

export default SearchedUserInfoComponent;
