import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext, useState } from "react";

export interface ApiKeyContextInterface {
  apiKey: string;
}

const ApiKeyContext = createContext<ApiKeyContextInterface | undefined>(
  undefined
);

export const useGithubApiKey = () => {
  const context = useContext(ApiKeyContext);

  if (context === undefined) {
    throw new Error("useGithubApiKey must be used within a GithubApiKey");
  }

  return context.apiKey;
};

export const ApiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useLocalStorage({
    key: "giyhub-api-key",
    defaultValue: undefined,
  });

  return (
    <ApiKeyContext.Provider value={{ apiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export default ApiKeyProvider;
