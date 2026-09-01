/* eslint-disable react/prop-types */
import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { withForwardedRef } from '../withForwardedRef';

const mockWrappedComponent = jest.fn(props => (
  <pre data-testid="wrapped-props">{JSON.stringify(props)}</pre>
));

const MockComponent = ({ children, className, forwardedRef }) => (
  <div className={className} ref={forwardedRef}>
    {children}
  </div>
);

describe('engage > core > hocs > withForwardedRef', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const ComposedComponent = withForwardedRef(mockWrappedComponent);
    const ref = createRef();
    const { container } = render((
      <ComposedComponent className="foo" ref={ref}>
        Testing 123
      </ComposedComponent>
    ));

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      className: 'foo',
      children: 'Testing 123',
      forwardedRef: ref,
    });
  });

  it('should inject the ref with a custom prop name', () => {
    const ComposedComponent = withForwardedRef(mockWrappedComponent, { prop: 'custom' });
    const ref = createRef();
    const { container } = render((
      <ComposedComponent className="foo" ref={ref}>
        Testing 123
      </ComposedComponent>
    ));

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      className: 'foo',
      children: 'Testing 123',
      custom: ref,
    });
  });

  it('should create a ref that points to a HTMLDivElement', () => {
    const ComposedComponent = withForwardedRef(MockComponent);
    const ref = createRef();
    render((
      <ComposedComponent className="foo" ref={ref}>
        Testing 123
      </ComposedComponent>
    ));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* eslint-enable react/prop-types */
