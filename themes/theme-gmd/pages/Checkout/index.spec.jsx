import React from 'react';
import { mount } from 'enzyme';
import { MockedView } from 'Components/View/mock';

jest.useFakeTimers();

const mockedView = MockedView;

jest.mock('Components/View', () => mockedView);

describe('Checkout', () => {
  let component;
  it('should create a component', () => {
    /* eslint-disable-next-line global-require */
    const Checkout = require('./index').default;
    component = mount(<Checkout />);
    expect(component.instance().timeout > 0).toBe(true);
    expect(component.find('LoadingIndicator').exists()).toBe(false);
    expect(component).toMatchSnapshot();
  });
  it('should show loading indicator', () => {
    jest.advanceTimersByTime(3000);
    component.update();
    expect(component.instance().timeout > 0).toBe(true);
    expect(component.find('LoadingIndicator').exists()).toBe(true);
    expect(component).toMatchSnapshot();
  });
  it('should clear a timeout ', () => {
    component.instance().componentWillUnmount();
    expect(clearTimeout).toHaveBeenCalled();
  });
});
