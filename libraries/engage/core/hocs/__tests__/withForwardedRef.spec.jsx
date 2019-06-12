import React, { createRef } from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { withForwardedRef } from '../withForwardedRef';

/* eslint-disable require-jsdoc, react/prop-types */
describe('withForwardedRef', () => {
  it('should render', () => {
    const Comp = ({ children, className, forwardedRef }) => (
      <div className={className} ref={forwardedRef}>
        {children}
      </div>
    );
    const WrappedComp = withForwardedRef(Comp);
    const ref = createRef();
    const wrapper = shallow((
      <WrappedComp className="foo" ref={ref} >
        Testing 123
      </WrappedComp>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.name()).toBe('Comp');
  });

  it('should render with a custom displayName', () => {
    const Comp = ({ children, className, forwardedRef }) => (
      <div className={className} ref={forwardedRef}>
        {children}
      </div>
    );
    Comp.displayName = 'FooBar';
    const WrappedComp = withForwardedRef(Comp);
    const ref = createRef();
    const wrapper = shallow((
      <WrappedComp className="foo" ref={ref} >
        Testing 123
      </WrappedComp>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.name()).toBe(Comp.displayName);
  });

  it('should create a ref that points to a HTMLDivElement', () => {
    const Comp = ({ children, className, forwardedRef }) => (
      <div className={className} ref={forwardedRef}>
        {children}
      </div>
    );
    const WrappedComp = withForwardedRef(Comp);
    const ref = createRef();
    renderIntoDocument((
      <WrappedComp className="foo" ref={ref} >
        Testing 123
      </WrappedComp>
    ));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* eslint-enable require-jsdoc, react/prop-types */
