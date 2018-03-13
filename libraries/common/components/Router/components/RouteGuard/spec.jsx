import React from 'react';
import { mount } from 'enzyme';
import RouteGuard from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<RouteGuard />', () => {
  /**
   * Creates a test component.
   * @returns {JSX} The test component.
   */
  const createComponent = () => mount((
    <RouteGuard currentRoute="initialRoute">
      <div id="TheContents" />
    </RouteGuard>
  ));

  it('should render the opened portal when on same route', () => {
    const wrapper = createComponent();

    // Do not change the route.
    wrapper.setProps({ currentRoute: 'initialRoute' });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('#TheContents').length).toBe(1);
  });

  it('should not render the opened portal when on another route', () => {
    const wrapper = createComponent();

    // This is what happens when the route is changed and the guard is connected to the store.
    wrapper.setProps({ currentRoute: 'anotherRoute' });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('#TheContents').length).toBe(0);
  });
});
