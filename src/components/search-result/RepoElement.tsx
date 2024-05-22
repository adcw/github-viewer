import { Group, Text, Paper, Divider, Anchor, Tooltip } from "@mantine/core";
import RepoModel from "../../types/repo_model";
import { useHover } from "@mantine/hooks";

import { IconExternalLink } from "@tabler/icons-react";

export interface RepoElementProps {
  repo: RepoModel;
}

const RepoElement = ({ repo }: RepoElementProps) => {

  const {hovered, ref} = useHover()
  return (
    <>
      <Paper py="md" px="sm" ref={ref}>
        <Group justify="space-between">
          <Text>{repo.name}</Text>
          <Text>{repo.created_at}</Text>
          <Anchor href={repo.html_url} target="_blank" hidden={!hovered}>
            <Tooltip label="Open github page">
              <IconExternalLink />
            </Tooltip>
          </Anchor>
        </Group>
      </Paper>
      <Divider />
    </>
  );
};

export default RepoElement;
