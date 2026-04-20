import React from 'react';
import { mount } from 'enzyme';
import Conditioner from '@shopgate/pwa-core/classes/Conditioner';
import ProductCharacteristics from './index';

const mockedConditioner = new Conditioner();
const mockedMapStateToPropsResult = {
  variants: {
    products: [{
      id: '32050590001000',
      characteristics: { 1: '1', 2: '11' },
    }, {
      id: '32050590000950',
      characteristics: { 1: '2', 2: '12' },
    }],
    characteristics: [
      {
        id: '1',
        label: 'Color',
        values: [
          { id: '1', label: 'BLACK-WHITE (9000)' },
          { id: '2', label: 'RED-WHITE (1000)' }],
      },
      {
        id: '2',
        label: 'Size',
        values: [
          { id: '11', label: '7' }, { id: '12', label: '7.5' },
        ],
      }],
  },
};
jest.mock('react-redux', () => ({
  connect: mapStateToProps => Component => props => (
    <Component
      variants={mockedMapStateToPropsResult.variants}
      {...props}
    />
  ),
}));

jest.mock('@shopgate/pwa-common/context', () => ({
  // eslint-disable-next-line react/prop-types
  Theme: ({ children, ...otherProps }) => {
    const Child = children;

    const props = {
      AppBar: () => null,
      Drawer: () => null,
      View: () => null,
      contexts: {
        ProductContext: {
          // eslint-disable-next-line react/prop-types
          Consumer: ({ children: ContextChildren, ...contextProps }) => (
            <ContextChildren
              options={{}}
              productId="123"
              variantId="123-45"
              conditioner={mockedConditioner}
              {...contextProps}
            />
          ),
        },
      },
      ...otherProps,
    };

    return (
      <Child {...props} />
    );
  },
}));

describe('components/ProductCharacteristics', () => {
  it('should render', () => {
    const component = mount((
      <ProductCharacteristics render={jest.fn()} />
    ));

    expect(component).toMatchSnapshot();
  });

  it('should call render prop', () => {
    const renderer = jest.fn();

    mount((
      <ProductCharacteristics render={renderer} />
    ));

    const expected1 = {
      charRef: { current: null },
      disabled: false,
      highlight: false,
      id: '1',
      key: '1',
      label: 'Color',
      selected: null,
      values: [
        { id: '1', label: 'BLACK-WHITE (9000)', selectable: true },
        { id: '2', label: 'RED-WHITE (1000)', selectable: true },
      ],
    };

    const expected2 = {
      charRef: { current: null },
      disabled: true,
      highlight: false,
      id: '2',
      key: '2',
      label: 'Size',
      selected: null,
      values: [
        { id: '11', label: '7', selectable: true },
        { id: '12', label: '7.5', selectable: true },
      ],
    };

    expect(renderer).toHaveBeenCalledTimes(2);

    const args1 = renderer.mock.calls[0][0];
    expect(typeof args1.select).toBe('function');
    expect(args1).toMatchObject(expected1);

    const args2 = renderer.mock.calls[1][0];
    expect(typeof args2.select).toBe('function');
    expect(args2).toMatchObject(expected2);
  });
});
