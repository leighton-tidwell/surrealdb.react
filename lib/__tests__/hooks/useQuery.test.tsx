import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import Surreal from 'surrealdb.js';
import { act, renderHook } from '../test-utils';

jest.mock('surrealdb.js');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('useQuery', () => {
  const mockUseContext = jest.spyOn(React, 'useContext');
  const mockSurrealClassQuery = jest.spyOn(Surreal.prototype, 'query');

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should return database results', async () => {
    mockUseContext.mockImplementation(() => ({
      database: new Surreal(),
      isReady: true,
      hasError: false,
      errorMessage: '',
    }));

    mockSurrealClassQuery.mockImplementation(() =>
      Promise.resolve([
        {
          time: '0us',
          status: 'OK',
          result: [
            { id: 'test:1', name: 'TEST USER' },
            { id: 'test:2', name: 'TEST USER 2' },
          ],
        },
      ]),
    );

    let renderResult = {} as any;
    await act(async () => {
      renderResult = renderHook(() => useQuery('SELECT * FROM TEST'));
    });

    const { data, loading, error, refetch, status, time } = renderResult?.result?.current;

    expect(data).toStrictEqual([
      { id: 'test:1', name: 'TEST USER' },
      { id: 'test:2', name: 'TEST USER 2' },
    ]);
    expect(time).toBe('0us');
    expect(status).toBe('OK');
    expect(loading).toBe(false);
    expect(error).toBe(false);
    expect(refetch).toBeInstanceOf(Function);
  });
});
