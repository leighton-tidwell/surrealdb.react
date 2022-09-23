import React from 'react';
import { useQuery, useSurreal } from 'lib';
import styles from './App.module.css';

const UseQueryStats = () => {
  const { data, error, loading } = useQuery('SELECT * FROM test');
  return (
    <div className={styles.stat}>
      <h1>Use Query Stats</h1>
      <div className={styles.subStat}>
        <h2>Status</h2>
        <p>{error ? 'Error' : loading ? 'Loading' : 'Ready'}</p>
      </div>
      <div className={styles.subStat}>
        <h2>Data</h2>
        <p>{data && JSON.stringify(data)}</p>
      </div>
      <div className={styles.subStat}>
        <h2>Error</h2>
        <p>{error ? 'Error' : 'No Error'}</p>
      </div>
      <div className={styles.subStat}>
        <h2>Error Message</h2>
        <p>{error ? error : 'No Error'}</p>
      </div>
    </div>
  );
};

const DatabaseStats = () => {
  const { database, isReady, hasError, errorMessage } = useSurreal();
  console.log('Surreal Class', database);

  return (
    <div className={styles.stat}>
      <h1>Database Stats</h1>
      <div className={styles.subStat}>
        <h2>Ready</h2>
        <p>{isReady ? 'Yes' : 'No'}</p>
      </div>
      <div className={styles.subStat}>
        <h2>Error</h2>
        <p>{hasError ? 'Error' : 'No Error'}</p>
      </div>
      <div className={styles.subStat}>
        <h2>Error Message</h2>
        <p>{errorMessage ? errorMessage : 'No Error'}</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className={styles.statsContainer} style={{ padding: '10em' }}>
      <DatabaseStats />
      <UseQueryStats />
    </div>
  );
}

export default App;
