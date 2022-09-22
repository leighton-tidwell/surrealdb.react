import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // TODO: investigate use of useAsyncEffect
  useEffect(() => {
    if (initialQuery) return;
    initialQuery = true;

    database
      .signin({ user, pass })
      .then(() => database.use(namespace, db))
      .then(() => {
        setIsReady(true);
      })
      .catch((error) => {
        setHasError(true);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
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
