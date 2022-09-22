import { useContext, useCallback, useEffect, useState } from 'react';
import { SurrealContext, SurrealContextType } from '../context/database';

interface QueryType {
  data: unknown;
  loading: boolean;
  error: string | boolean | null;
  refetch: (refetchArgs: any) => Promise<any>;
  status: 'PENDING' | 'INFLIGHT' | 'OK' | 'ERR';
  time?: string | null;
}

type OptionsType = {
  immediate: boolean;
};

export const useQuery = (query: string, args: object = {}, options: OptionsType = { immediate: true }): QueryType => {
  const { database, isReady } = useContext<SurrealContextType>(SurrealContext);
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | boolean | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'INFLIGHT' | 'OK' | 'ERR'>('PENDING');

  const refetch = useCallback(
    async (refetchArgs: object = {}) => {
      if (isReady) {
        setStatus('INFLIGHT');
        const response = (await database?.query(query, Object.keys(refetchArgs).length ? refetchArgs : args)) as Array<{
          time: string;
          status: string;
          result: unknown;
          detail?: string;
        }>;

        if (response.length) {
          setTime(response[0].time);

          if (response[0].status === 'OK') {
            setData(response[0].result);
            setStatus('OK');
            setLoading(false);
            setError(false);

            return response[0].result;
          } else if (response[0].status === 'ERR' && response[0].detail) {
            setStatus('ERR');
            setLoading(false);
            setError(response[0].detail);
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
