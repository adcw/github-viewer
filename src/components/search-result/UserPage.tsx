import {
  Grid,
  Card,
  Title,
  Stack,
  Table,
  Group,
  Avatar,
  Text,
  Paper,
  Divider,
  ScrollArea,
  Loader,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import UserModel from "../../types/user_model";
import { IconPhoneCall, IconAt } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Octokit } from "octokit";
import RepoModel from "../../types/repo_model";
import RepoElement from "./RepoElement";

export interface SearchedUserInfoProps {
  result: UserModel;
  getClient: () => Octokit;
}

const SearchedUserInfo = ({
  result: user,
  getClient,
}: SearchedUserInfoProps) => {
  const [repos, setRepos] = useState<RepoModel[] | undefined>(undefined);

  const isMobile = useMediaQuery("(max-width: 755px)");

  const getRepos = useCallback(async () => {
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
    return <>User not found</>;
  }

  if (user === undefined) {
    return <>Go ahead and search</>;
  }

  return (
    <Group grow align="flex-start">
      <Card mih={400} maw="fit-content">
        <Group wrap="nowrap">
          <Avatar src={user.avatar_url} size={94} radius="md" />
          <div>
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
          </div>
        </Group>
      </Card>
      <Group grow>
        {repos === undefined ? 
        <Stack gap={0}>
          {[0, 1, 2, 3, 4].map((v, k) => (
            <Skeleton key={k} height={60} mt={6} width="100%" />
          ))}
        </Stack>: ""}


        {repos !== undefined && repos.length > 0 ? (
          <Stack gap={0}>
            <Title order={4} mb="md">
              Repositories owned by the user:
            </Title>
            {repos.map((r) => {
              return <RepoElement key={r.id} repo={r} />;
            })}
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
