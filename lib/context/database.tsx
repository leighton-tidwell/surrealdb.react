import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// @ts-expect-error
import Surreal from 'surrealdb.js';

export interface SurrealContextType {
  database?: InstanceType<typeof Surreal>;
  isReady: boolean;
  hasError: boolean;
  errorMessage: string;
}

export const SurrealContext = createContext<SurrealContextType>({
  database: undefined,
  isReady: false,
  hasError: false,
  errorMessage: '',
});

interface SurrealProviderProps {
  children?: ReactNode;
  database: InstanceType<typeof Surreal>;
  options: {
    user: string;
    pass: string;
    database: string;
    namespace: string;
  };
}

let initialQuery = false;

export const DatabaseProvider = ({ children, database, options }: SurrealProviderProps) => {
  if (!database) throw new Error('DatabaseProvider requires an initialized instance of SurrealDB.');

  const { user, pass, database: db, namespace } = options;

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const init = useCallback(async () => {
    await database.signin({
      user,
      pass,
    });

    await database.use(namespace, db);

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (initialQuery) return;
    initialQuery = true;

    init().catch((err: Error) => {
      setHasError(true);
      setErrorMessage(err.message);
    });
  }, []);

  return (
    <SurrealContext.Provider value={{ database, isReady, hasError, errorMessage }}>{children}</SurrealContext.Provider>
  );
};

export const useSurreal = (): SurrealContextType => {
  const { database, isReady, hasError, errorMessage } = useContext(SurrealContext);
  return { database, isReady, hasError, errorMessage };
};
