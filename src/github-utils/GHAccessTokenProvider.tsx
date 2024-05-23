import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { Octokit } from "octokit";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface GHAccessTokenInterface {
  accessToken: string;
  openModal: () => void;
}

const GHAccessTokenContext = createContext<GHAccessTokenInterface | undefined>(
  undefined
);

export const useGithubAccessToken = (): GHAccessTokenInterface => {
  const context = useContext(GHAccessTokenContext);

  if (context === undefined) {
    throw new Error(
      "useGithubAccessToken must be used within a GHAccessTokenProvider"
    );
  }

  return context;
};

const testToken = async (token: string): Promise<boolean> => {
  const octokit = new Octokit({
    auth: token,
  });

  try {
    await octokit.rest.users.getAuthenticated();
    return true;
  } catch (error) {
    return false;
  }
};

interface GHAccessTokenProviderProps {
  children: React.ReactNode;
}

export const GHAccessTokenProvider: React.FC<GHAccessTokenProviderProps> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>({
    key: "github-api-key",
    defaultValue: undefined,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const revalidateToken = useCallback(async () => {
    if (accessToken) {
      const isValid = await testToken(accessToken);
      if (!isValid) {
        open();
      }
    }
    if (!accessToken) {
      open();
    }
  }, [accessToken, open]);

  useEffect(() => {
    revalidateToken();
  }, [revalidateToken]);

  const handleSubmit = async () => {
    const enteredToken = inputRef.current?.value || "";

    const valid = await testToken(enteredToken);

    if (valid) {
      setAccessToken(enteredToken);
      close();
    } else {
      setError("Invalid API key. Try again.");
    }
  };

  return (
    <GHAccessTokenContext.Provider
      value={{ accessToken: accessToken, openModal: open }}
    >
      <Modal
        opened={opened}
        withCloseButton={false}
        onClose={close}
        closeOnEscape={false}
        closeOnClickOutside={false}
        title="Configuration"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack>
          <TextInput
            error={error}
            ref={inputRef}
            defaultValue={accessToken}
            onChange={() => {
              if (error) setError(null);
            }}
            label="Please enter your GitHub API key:"
            description="In order to fetch data, we need your API key. It will be stored in the local storage."
            placeholder="Eg. sdefefsefefs"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />

          <Button variant="light" onClick={handleSubmit}>
            Ok
          </Button>
        </Stack>
      </Modal>
      {children}
    </GHAccessTokenContext.Provider>
  );
};

export default GHAccessTokenProvider;
