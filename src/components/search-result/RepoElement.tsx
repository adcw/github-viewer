import { Table, Text, Anchor, Tooltip, Group } from "@mantine/core";
import RepoModel from "../../types/repo_model";
import { useHover } from "@mantine/hooks";
import { IconExternalLink, IconStar } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

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
        <Text py="xs">{repo.created_at}</Text>
      </td>
      <td>
        <Group gap={4}>
          <Anchor
            py="xs"
            href={repo.stargazers_url}
            target="_blank"
          >
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
