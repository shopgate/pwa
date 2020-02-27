import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
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

beforeEach(() => {
  jest.resetModules();
});

describe('<FavoritesButton />', () => {
  let component = null;

  /**
   * Creates component with provided store state.
   * @param {Object} mockedState Mocked stage.
   * @param {Object} props Additional props.
   * @return {ReactWrapper}
   */
  const createComponent = (mockedState, props = { active: false }) => {
    const store = mockedStore(mockedState);
    store.dispatch = dispatcher;

    return mount(
      <Provider store={store}>
        <FavoritesButton
          {...props}
        />
      </Provider>,
      mockRenderOptions
    );
  };
  beforeEach(() => {
    dispatcher.mockReset();
  });

  it('should only render when no favorites set', () => {
    component = createComponent(mockedStateEmpty);
    expect(component).toMatchSnapshot();

    expect(component.find('Heart').exists()).toBe(false);
    expect(component.find('HeartOutline').exists()).toBe(true);

    component.find('button').simulate('click');
  });

  it('should render when favorites set', () => {
    component = createComponent(mockedStateOnList, { active: true });
    expect(component).toMatchSnapshot();

    expect(component.find('Heart').exists()).toBe(true);
    expect(component.find('HeartOutline').exists()).toBe(false);
  });

  it('should add to favorites on click', () => {
    component = createComponent(mockedStateNotOnList, {
      productId: '1',
      active: false,
    });
    expect(component.find('Heart').exists()).toBe(false);
    expect(component.find('HeartOutline').exists()).toBe(true);

    component.find('button').simulate('click');
    component.update();
    expect(dispatcher).toHaveBeenCalled();
  });

  it('should remove from favorites on click', (done) => {
    component = createComponent(mockedStateOnList, {
      productId: '1',
      active: true,
    });
    expect(component.find('Heart').exists()).toBe(true);
    expect(component.find('HeartOutline').exists()).toBe(false);

    component.find('button').simulate('click');
    component.update();
    setTimeout(() => {
      expect(dispatcher).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should process ripple complete callback', () => {
    const onRippleComplete = jest.fn();
    component = createComponent(mockedStateOnList, {
      productId: '1',
      active: true,
      onRippleComplete,
    });
    component.find('Ripple').instance().props.onComplete();
    component.update();
    expect(onRippleComplete).toHaveBeenCalled();
  });

  it('should only react on first click', (done) => {
    component = createComponent(mockedStateOnList, {
      once: true,
      productId: '1',
      active: false,
    });
    component.find('button').simulate('click');
    component.update();
    component.find('button').simulate('click');
    component.update();
    setTimeout(() => {
      expect(dispatcher.mock.calls.length).toBe(1);
      done();
    }, 1);
  });
  it('should only react on both clicks', (done) => {
    component = createComponent(mockedStateOnList, {
      productId: '1',
      active: false,
    });
    component.find('button').simulate('click');
    component.update();
    component.find('button').simulate('click');
    component.update();
    setTimeout(() => {
      expect(dispatcher.mock.calls.length).toBe(2);
      done();
    }, 1);
  });

  it('should render null when feature flag is off', () => {
    jest.spyOn(appConfig, 'hasFavorites', 'get').mockReturnValue(false);
    component = createComponent(mockedStateOnList);
    expect(component.html()).toBe(null);
  });
});
