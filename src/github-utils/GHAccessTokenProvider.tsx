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
}

const GHAccessTokenContext = createContext<GHAccessTokenInterface | undefined>(
  undefined
);

export const useGithubAccessToken = () => {
  const context = useContext(GHAccessTokenContext);

  if (context === undefined) {
    throw new Error("useGithubAccessToken must be used within a GHAccessToken");
  }

  return context.accessToken;
};

const testToken = async (token: string) => {
  const octokit = new Octokit({
    auth: token,
  });

  try {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();
  } catch (error) {
    console.log("invalid token");
    return false;
  }
  return true;
};

export const GHAccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage({
    key: "giyhub-api-key",
    defaultValue: undefined,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const revalidateToken = useCallback(async () => {
    await testToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken === undefined) {
      open();
      return;
    }

    const isValid = revalidateToken();
    if (!isValid) {
      console.log("Invalid token");

      open();
    }
  }, [accessToken, open, revalidateToken]);

  const handleSubmit = async () => {
    const enteredToken = inputRef.current.value;

    const valid = await testToken(enteredToken);

    if (valid) {
      setAccessToken(enteredToken);
      close();
    } else {
      setError("Invalid API key. Try again.");
    }
  };

  return (
    <GHAccessTokenContext.Provider value={{ accessToken: accessToken }}>
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
            label="Please enter yout github api key:"
            description="In order to fetch data, we need your api key. It will be stored in the local storage."
            placeholder="Eg. sdefefsefefs"
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
