import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor/constants';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { NAVIGATE } from '@shopgate/pwa-common/constants/ActionTypes';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import { getStore } from './mock';
import Navigator from './index';

jest.mock('./context');

// eslint-disable-next-line react/prop-types
jest.mock('./components/CartButton', () => ({ children }) => (<div>{children} </div>));
// eslint-disable-next-line react/prop-types
jest.mock('./components/NavButton', () => ({ children }) => (<div>{children} </div>));

let mockedRoutePattern = '/';
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({ pattern: mockedRoutePattern }));

const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

const results = [
  [
    {
      type: NAVIGATE,
      action: ACTION_REPLACE,
      location: '/search?s=shirt',
      state: undefined,
    },
  ],
  [
    {
      type: NAVIGATE,
      action: ACTION_PUSH,
      location: '/search?s=skirt',
      state: undefined,
    },
  ],
];

describe('Navigator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render nothing', () => {
    const component = mount(
      <Provider store={getStore({ enabled: false })}>
        <Navigator />
      </Provider>,
      mockRenderOptions
    );
    expect(component.html()).toBe(null);
  });
  it('should render the component and update when props change', () => {
    const component = mount(
      <Provider store={getStore({ enabled: true })}>
        <Navigator />
      </Provider>,
      mockRenderOptions
    );
    expect(component.find('header').exists()).toBe(true);
  });

  it('should render search', () => {
    const store = getStore({ enabled: true, showTitle: true, showSearch: true });

    const component = mount(
      <Provider store={store}>
        <Navigator />
      </Provider>,
      mockRenderOptions
    );

    expect(component.find('NavigatorSearch').exists()).toBe(true);
    expect(component).toMatchSnapshot();
  });

  it('setRoutePattern', () => {
    const component = mount(
      <Provider store={getStore({})}>
        <Navigator />
      </Provider>,
      mockRenderOptions
    );

    expect(component.find('Navigator').instance().state.routePattern).toEqual('');

    mockedRoutePattern = '/search';
    component.find('Navigator').instance().setRoutePattern();

    component.update();
    expect(component.find('Navigator').instance().state.routePattern).toEqual(mockedRoutePattern);
  });

  it('setSearchQuery', () => {
    const component = mount(
      <Provider store={getStore({})}>
        <Navigator />
      </Provider>,
      mockRenderOptions
    );

    component.find('Navigator').instance().setSearchQuery('skirt');
    expect(component.find('Navigator').instance().state.searchQuery).toEqual('skirt');
  });

  describe('search navigation', () => {
    let store;

    /* eslint-disable-next-line require-jsdoc */
    const createComponent = () => {
      store = getStore({ enabled: true, showTitle: true, showSearch: true });
      const component = mount(
        <Provider store={store}>
          <Navigator />
        </Provider>,
        mockRenderOptions
      );
      return component.find('Navigator');
    };

    afterEach(() => {
      store.clearActions();
    });

    it('should not navigate', () => {
      const active = false;
      const NavigatorWrapper = createComponent();
      NavigatorWrapper.instance().setState({
        searchQuery: 'shirt',
        routePattern: '/search',
        searchField: active,
      });

      NavigatorWrapper.instance().toggleSearchField(active);

      expect(store.getActions().length).toEqual(0);
    });

    it('should navigate search (replace)', () => {
      const NavigatorWrapper = createComponent();
      const replaceFromPath = '/search';

      NavigatorWrapper.instance().setState({
        searchQuery: 'shirt',
        routePattern: replaceFromPath,
        searchField: true,
      });
      NavigatorWrapper.instance().toggleSearchField(false, true);

      expect(store.getActions()).toEqual(results[0]);
    });

    it('should navigate search (push)', () => {
      const NavigatorWrapper = createComponent();
      const pushFromPath = '/category';

      NavigatorWrapper.instance().setState({
        searchQuery: 'skirt',
        routePattern: pushFromPath,
        searchField: true,
      });
      NavigatorWrapper.instance().toggleSearchField(false, true);

      expect(store.getActions()).toEqual(results[1]);
    });
  });
});
