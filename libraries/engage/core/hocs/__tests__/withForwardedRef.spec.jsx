/* eslint-disable require-jsdoc, react/prop-types */
import React, { createRef } from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { withForwardedRef } from '../withForwardedRef';

const MockComponent = ({ children, className, forwardedRef }) => (
  <div className={className} ref={forwardedRef}>
    {children}
  </div>
);

describe('engage > core > hocs > withForwardedRef', () => {
  it('should render', () => {
    const ComposedComponent = withForwardedRef(MockComponent);
    const ref = createRef();
    const wrapper = shallow((
      <ComposedComponent className="foo" ref={ref} >
        Testing 123
      </ComposedComponent>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.props()).toEqual({
      className: 'foo',
      children: 'Testing 123',
      forwardedRef: { current: null },
    });
  });

  it('should inject the ref with a custom prop name', () => {
    const ComposedComponent = withForwardedRef(MockComponent, { prop: 'custom' });
    const ref = createRef();
    const wrapper = shallow((
      <ComposedComponent className="foo" ref={ref} >
        Testing 123
      </ComposedComponent>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.props()).toEqual({
      className: 'foo',
      children: 'Testing 123',
      custom: { current: null },
    });
  });

  it('should create a ref that points to a HTMLDivElement', () => {
    const ComposedComponent = withForwardedRef(MockComponent);
    const ref = createRef();
    renderIntoDocument((
      <ComposedComponent className="foo" ref={ref} >
        Testing 123
      </ComposedComponent>
    ));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* eslint-enable require-jsdoc, react/prop-types */
