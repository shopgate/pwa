import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import category from '@shopgate/pwa-common-commerce/category/reducers';
import { useLevel } from './hooks';

let mockFailures = 0;

jest.mock('@shopgate/engage/category/actions', () => {
  const creators = '@shopgate/pwa-common-commerce/category/action-creators';
  const { default: requestCategoryChildren } = jest.requireActual(`${creators}/requestCategoryChildren`);
  const { default: receiveCategoryChildren } = jest.requireActual(`${creators}/receiveCategoryChildren`);
  const { default: errorCategoryChildren } = jest.requireActual(`${creators}/errorCategoryChildren`);
  const { default: requestRootCategories } = jest.requireActual(`${creators}/requestRootCategories`);
  const { default: receiveRootCategories } = jest.requireActual(`${creators}/receiveRootCategories`);

  return {
    fetchCategoryChildren: (categoryId: string) => (dispatch: (action: unknown) => void) => {
      dispatch(requestCategoryChildren(categoryId));

      if (mockFailures > 0) {
        mockFailures -= 1;
        dispatch(errorCategoryChildren(categoryId));
        return Promise.reject(new Error('failed'));
      }

      dispatch(receiveCategoryChildren(categoryId, [{
        id: 'jackets',
        name: 'Jackets',
      }]));
      return Promise.resolve();
    },
    fetchRootCategories: () => (dispatch: (action: unknown) => void) => {
      dispatch(requestRootCategories());
      dispatch(receiveRootCategories([]));
      return Promise.resolve();
    },
  };
});

const Probe = ({ categoryId }: { categoryId: string | null }) => {
  const {
    ids, isLoading, hasError, retry,
  } = useLevel(categoryId);

  return (
    <div>
      <span>{`ids:${ids === null ? 'null' : ids.join(',')}`}</span>
      <span>{`loading:${isLoading}`}</span>
      <span>{`error:${hasError}`}</span>
      <button type="button" onClick={retry}>retry</button>
    </div>
  );
};

const renderProbe = (categoryId: string | null) => render(
  <Provider store={createStore(combineReducers({ category }), applyMiddleware(thunk))}>
    <Probe categoryId={categoryId} />
  </Provider>
);

const flush = () => act(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
});

describe('CategoryDrawer useLevel()', () => {
  beforeEach(() => {
    mockFailures = 0;
  });

  it('loads the children of a category', async () => {
    renderProbe('men');
    await flush();

    expect(screen.getByText('ids:jackets')).toBeInTheDocument();
    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('error:false')).toBeInTheDocument();
  });

  it('reports a failed level and loads it again on retry', async () => {
    mockFailures = 1;
    renderProbe('men');
    await flush();

    expect(screen.getByText('ids:null')).toBeInTheDocument();
    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('error:true')).toBeInTheDocument();

    await act(async () => {
      screen.getByRole('button', { name: 'retry' }).click();
    });
    await flush();

    expect(screen.getByText('ids:jackets')).toBeInTheDocument();
    expect(screen.getByText('error:false')).toBeInTheDocument();
  });

  it('treats an empty root level as empty, not as failed', async () => {
    renderProbe(null);
    await flush();

    expect(screen.getByText('ids:')).toBeInTheDocument();
    expect(screen.getByText('error:false')).toBeInTheDocument();
  });
});
