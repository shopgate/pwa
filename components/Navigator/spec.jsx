import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { getStore } from './mock';
import Navigator from './index';

// eslint-disable-next-line react/prop-types
jest.mock('./components/CartButton', () => ({ children }) => (<div>{ children} </div>));
// eslint-disable-next-line react/prop-types
jest.mock('./components/NavButton', () => ({ children }) => (<div>{ children} </div>));

describe('Navigator', () => {
  it('should render nothing', () => {
    const component = mount((
      <Provider store={getStore({ enabled: false })}>
        <Navigator />
      </Provider>
    ));
    expect(component.html()).toBe(null);
  });
  it('should render the component and update when props change', () => {
    const component = mount((
      <Provider store={getStore({ enabled: true })}>
        <Navigator />
      </Provider>
    ));
    expect(component.find('header').exists()).toBe(true);
    const propsUpdate = {
      backgroundColor: 'greenish',
      textColor: 'blueish',
      showTitle: true,
      filterOpen: true,
      navigatorEnabled: false,
      showLoadingBar: true,
    };
    const compInstance = component.find('Navigator').at(0).instance();
    const { props } = compInstance;
    Object.keys(propsUpdate).forEach((key) => {
      expect(compInstance.shouldComponentUpdate({
        ...props,
        [key]: propsUpdate[key],
      })).toBe(true);
    });
  });
});
