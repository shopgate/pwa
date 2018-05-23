import {
  LOCALSTORAGE_KEY,
  initPersistentStorage,
  persist,
  normalizeState,
} from './persistent';

const localStorageMock = global.window.localStorage;

describe.skip('Persistent State storage', () => {
  const storageKey = LOCALSTORAGE_KEY;
  const fooReducer = persist('foo', () => ({ foo: 1 }), 'v1');
  const barReducer = persist('bar', () => ({ bar: 2 }), 'v2');

  it('should create empty state when nothing was saved', () => {
    localStorageMock.clear();
    expect(initPersistentStorage()).toEqual({});
  });

  it('should persist when all versions are valid', () => {
    localStorageMock.clear();
    localStorageMock.setItem(storageKey, JSON.stringify({
      foo: {
        version: 'v1',
        state: { foo: 1 },
      },
      bar: {
        version: 'v2',
        state: { bar: 2 },
      },
    }));
    expect(initPersistentStorage()).toEqual({
      foo: { foo: 1 },
      bar: { bar: 2 },
    });
  });

  it('should not persist when version is invalid', () => {
    localStorageMock.clear();
    localStorageMock.setItem(storageKey, JSON.stringify({
      foo: {
        version: 'v1',
        state: { foo: 1 },
      },
      bar: {
        version: 'v1',
        state: { bar: 1 },
      },
    }));
    expect(initPersistentStorage()).toEqual({
      foo: { foo: 1 },
    });
  });

  it('should update storage after reducer has been called', (done) => {
    localStorageMock.clear();
    localStorageMock.setItem(storageKey, JSON.stringify({
      foo: {
        version: 'v1',
        state: { foo: 1 },
      },
      bar: {
        version: 'v1',
        state: { bar: 1 },
      },
    }));
    initPersistentStorage();

    fooReducer();
    barReducer();

    setTimeout(() => {
      expect(JSON.parse(localStorageMock.getItem(storageKey))).toEqual({
        foo: {
          version: 'v1',
          state: { foo: 1 },
        },
        bar: {
          version: 'v2',
          state: { bar: 2 },
        },
      });
      done();
    }, 2000);
  });

  it('should not persist isFetching flags that are true', () => {
    const testState = {
      foo: {
        bar: {
          isFetching: true,
          baz: [
            { isFetching: true },
            { qux: { isFetching: true } },
          ],
        },
        isFetching: {
          foolMeOnce: {
            isFetching: true,
          },
        },
      },
    };

    const expectedState = {
      foo: {
        bar: {
          isFetching: false,
          baz: [
            { isFetching: false },
            { qux: { isFetching: false } },
          ],
        },
        isFetching: {
          foolMeOnce: {
            isFetching: false,
          },
        },
      },
    };

    expect(normalizeState(testState)).toEqual(expectedState);
  });
});
