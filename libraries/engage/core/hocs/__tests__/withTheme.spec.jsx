import React from 'react';
import { mount } from 'enzyme';
import { withTheme } from '../withTheme';

const mockTheme = {
  ComponentOne: function ComponentOne() { return (<div />); },
  ComponentTwo: function ComponentTwo() { return (<div />); },
};

const mockContext = jest.fn().mockReturnValue(mockTheme);

jest.mock('@shopgate/pwa-common/context', () => ({
  ThemeContext: {
    Consumer: ({ children }) => children(mockContext()),
  },
}));

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

describe('engage > core > hocs > withTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the context properties into the component', () => {
    const ComposedComponent = withTheme(MockComponent);
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      ...mockTheme,
    });
  });

  it('should inject a single property with the context into the component', () => {
    const ComposedComponent = withTheme(MockComponent, { prop: 'theme' });
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      theme: {
        ...mockTheme,
      },
    });
  });
});
