import React from 'react';
import { mount } from 'enzyme';
import {
  push, pop, replace, reset, update,
} from '../../router/helpers';
import { withNavigation } from '../withNavigation';

const navigationProps = {
  historyPush: push,
  historyPop: pop,
  historyReplace: replace,
  historyReset: reset,
  historyUpdate: update,
};

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

describe('engage > core > hocs > withNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the navigation properties into the component', () => {
    const ComposedComponent = withNavigation(MockComponent);
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      ...navigationProps,
    });
  });

  it('should inject a single property with the navigation into the component', () => {
    const ComposedComponent = withNavigation(MockComponent, { prop: 'navigation' });
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      navigation: {
        ...navigationProps,
      },
    });
  });
});
