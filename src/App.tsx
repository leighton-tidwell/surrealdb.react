import React from 'react';
import { useQuery, useSurreal } from '@leighton-tidwell/surrealdb.react';

function App() {
  const { data, error, loading } = useQuery('SELECT * FROM test');
  const { database, isReady, hasError, errorMessage } = useSurreal();

  console.log('Surreal Class', database);

  return (
    <div className="App" style={{ padding: '10em' }}>
      <b>Database Status:</b>
      {isReady ? 'Ready' : 'Not Ready'}
      <br />
      <b>Error:</b> {hasError ? 'Error' : 'No Error'}
      <br />
      {errorMessage && (
        <>
          <b>Error Message:</b> {errorMessage}
        </>
      )}
      <br />
      <br />
      <b>Query Status:</b>
      {error ? 'Error' : loading ? 'Loading' : 'Ready'}
      <br />
      {data && <b>Data: {JSON.stringify(data)}</b>}
      <br />
      <b>Error:</b> {error ? 'Error' : 'No Error'}
      <br />
      {error && <b>Error Message: {error}</b>}
      <br />
    </div>
  );
}

export default App;
