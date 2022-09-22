import { useContext, useCallback, useEffect, useState } from 'react';
import { SurrealContext, SurrealContextType } from '../context/database.js';

interface QueryProps {
  query: string;
  args: any;
  options: {
    immediate?: boolean;
  };
}

interface QueryType {
  data: unknown;
  loading: boolean;
  error: string | boolean | null;
  refetch: (refetchArgs: any) => Promise<any>;
  status: 'PENDING' | 'INFLIGHT' | 'OK' | 'ERR';
  time?: string | null;
}

const defaultOptions = {
  immediate: true,
};

export const useQuery = ({ query, args = {}, options = {} }: QueryProps): QueryType => {
  const { database, isReady } = useContext<SurrealContextType>(SurrealContext);
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | boolean | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'INFLIGHT' | 'OK' | 'ERR'>('PENDING');
  options = { ...defaultOptions, ...options };

  const refetch = useCallback(
    async (refetchArgs: any = {}) => {
      if (isReady) {
        setStatus('INFLIGHT');
        const response = (await database?.query(query, Object.keys(refetchArgs).length ? refetchArgs : args)) as Array<{
          time: string;
          status: string;
          result: unknown;
        }>;

        if (response.length) {
          setTime(response[0].time);

          if (response[0].status === 'OK') {
            setData(response[0].result);
            setStatus('OK');
            setLoading(false);
            setError(false);

            return response[0].result;
          } else {
            setStatus('ERR');
            setLoading(false);
            setError('Something went wrong.');
          }
        }
      } else {
        setLoading(false);
        setError('Database is not ready.');
      }
    },
    [query, isReady],
  );

  useEffect(() => {
    if (isReady && status === 'PENDING' && options.immediate !== false) {
      refetch();
    }
  }, [isReady]);

  return { data, loading, error, refetch, status, time };
};
