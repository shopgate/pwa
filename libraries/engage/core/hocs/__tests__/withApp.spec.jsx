import React from 'react';
import { mount } from 'enzyme';
import { withApp } from '../withApp';

const mockApp = {
  some: 'prop',
};

const mockContext = jest.fn().mockReturnValue(mockApp);

jest.mock('../../contexts/AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

describe('engage > core > hocs > withApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject a property called "app" into the component', () => {
    const ComposedComponent = withApp(MockComponent);
    const wrapper = mount(<ComposedComponent someProp />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).props()).toEqual({
      someProp: true,
      app: {
        ...mockApp,
      },
    });
  });
});
