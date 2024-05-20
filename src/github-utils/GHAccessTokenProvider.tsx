import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { createContext, useContext, useEffect, useRef, useState } from "react";

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

export const GHAccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage({
    key: "giyhub-api-key",
    defaultValue: undefined,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (accessToken === undefined) {
      open();
    } else close()
  }, [accessToken]);

  const handleSubmit = () => {
    const enteredToken = inputRef.current.value;

    // TODO: Add validation
    setAccessToken(enteredToken);
    close()
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
            ref={inputRef}
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
