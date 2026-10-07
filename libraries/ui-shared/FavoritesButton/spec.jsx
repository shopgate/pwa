import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import FavoritesButton from './index';
import {
  mockedStateEmpty,
  mockedStateOnList,
  mockedStateNotOnList,
} from './mock';

const mockedStore = configureStore();
const dispatcher = jest.fn();

jest.mock('@shopgate/pwa-common/helpers/config');
jest.mock('@shopgate/pwa-common-commerce/favorites/selectors/index', () => ({
  isFetching: () => false,
}));
jest.mock('../icons/HeartIcon', () => () => 'heart-icon');
jest.mock('../icons/HeartOutlineIcon', () => () => 'heart-outline-icon');

describe('<FavoritesButton />', () => {
  /**
   * Renders the component with the provided store state.
   * @param {Object} mockedState Mocked stage.
   * @param {Object} props Additional props.
   * @return {Object}
   */
  const createComponent = (mockedState, props = { active: false }) => {
    const store = mockedStore(mockedState);
    store.dispatch = dispatcher;

    return render((
      <Provider store={store}>
        <FavoritesButton
          {...props}
        />
      </Provider>
    ));
  };
  beforeEach(() => {
    dispatcher.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should only render when no favorites set', () => {
    createComponent(mockedStateEmpty);

    const button = screen.getByRole('button', { name: 'favorites.add' });

    expect(button).toHaveClass('ui-shared__favorites-button');
    expect(button).toHaveAttribute('data-test-id', 'favoriteButton');
    expect(button).toHaveTextContent('heart-outline-icon');

    fireEvent.click(button);

    expect(dispatcher).not.toHaveBeenCalled();
  });

  it('should render when favorites set', () => {
    createComponent(mockedStateOnList, { active: true });

    const button = screen.getByRole('button', { name: 'favorites.remove' });

    expect(button).toHaveClass('ui-shared__favorites-button');
    expect(button).toHaveAttribute('data-test-id', 'favoriteButton');
    expect(button).toHaveTextContent('heart-icon');
  });

  it('should add to favorites on click', () => {
    createComponent(mockedStateNotOnList, {
      productId: '1',
      active: false,
    });

    const button = screen.getByRole('button', { name: 'favorites.add' });

    expect(button).toHaveTextContent('heart-outline-icon');

    fireEvent.click(button);
    expect(dispatcher).toHaveBeenCalled();
  });

  it('should remove from favorites on click', async () => {
    createComponent(mockedStateOnList, {
      productId: '1',
      active: true,
    });

    const button = screen.getByRole('button', { name: 'favorites.remove' });

    expect(button).toHaveTextContent('heart-icon');

    fireEvent.click(button);

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalled();
    });
  });

  it('should only react on first click', () => {
    createComponent(mockedStateOnList, {
      once: true,
      productId: '1',
      active: false,
    });

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    expect(dispatcher).toHaveBeenCalledTimes(1);
  });

  it('should only react on both clicks', () => {
    createComponent(mockedStateOnList, {
      productId: '1',
      active: false,
    });

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    expect(dispatcher).toHaveBeenCalledTimes(2);
  });

  it('should render null when feature flag is off', () => {
    jest.spyOn(appConfig, 'hasFavorites', 'get').mockReturnValue(false);
    const { container } = createComponent(mockedStateOnList);

    expect(container).toBeEmptyDOMElement();
  });
});
