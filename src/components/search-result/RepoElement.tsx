import { Anchor, Group, Pill, Table, Text, Tooltip } from "@mantine/core";
import { IconExternalLink, IconStar } from "@tabler/icons-react";
import RepoModel from "../../types/repo_model";
import DateText from "../dates/DateText";

export interface RepoElementProps {
  repo: RepoModel;
}

const RepoElement = ({ repo }: RepoElementProps) => {
  return (
    <Table.Tr>
      <td>
        <Text py="xs">{repo.name}</Text>
      </td>
      <td>
        <Group gap={4}>
          <Text size="xs" c="dimmed">
            Created at:
          </Text>
          <DateText
            size="xs"
            c="dimmed"
            py="xs"
            date_string={repo.created_at}
          />
        </Group>
      </td>
      <td>
        <Group miw="300" gap="xs">
          {repo.topics.map((v, k) => (
            <Pill key={k} bg="dark.6" size="xs">
              {v}
            </Pill>
          ))}
        </Group>
      </td>
      <td>
        <Group gap={4}>
          <Anchor py="xs" href={repo.stargazers_url} target="_blank">
            <Tooltip label="Stargazers">
              <IconStar height={16} />
            </Tooltip>
          </Anchor>
          <Text py="xs">{repo.stargazers_count}</Text>
        </Group>
      </td>
      <td>
        <Anchor py="xs" href={repo.html_url} target="_blank">
          <Tooltip label="Open github page">
            <IconExternalLink />
          </Tooltip>
        </Anchor>
      </td>
    </Table.Tr>
  );
};

export interface RepoTableProps {
  repos: RepoModel[];
}

const RepoTable = ({ repos }: RepoTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {repos.map((repo) => (
          <RepoElement key={repo.id} repo={repo} />
        ))}
      </tbody>
    </Table>
  );
};

export default RepoTable;
