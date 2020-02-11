import React from 'react';
import { mount } from 'enzyme';
import Grid from '../../../Grid';
import Widget from './index';

jest.mock('react', () => ({
  ...require.requireActual('react'),
  Suspense: function Suspense({ children }) { return children; },
}));

/**
 * A dummy component.
 * @returns {JSX}
 */
const MyComponent = () => (
  <div />
);

const widgets = {
  '@shopgate/commerce-widgets/image': MyComponent,
};

describe('<Widget />', () => {
  it('should render an image widget', () => {
    const config = {
      type: '@shopgate/commerce-widgets/image',
      col: 1,
      row: 1,
      width: 12,
      height: 6,
    };

    const wrapper = mount((
      <Widget config={config} component={widgets[config.type]} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Grid.Item).exists()).toBe(true);
  });

  it('should render an image widget with offset', () => {
    const config = {
      type: '@shopgate/commerce-widgets/image',
      col: 1,
      row: 1,
      width: 6,
      height: 6,
    };

    const wrapper = mount((
      <Widget config={config} component={widgets[config.type]} cellSize={100} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Grid.Item).exists()).toBe(true);
  });

  it('should not render when the `type` prop is invalid', () => {
    const config = {
      type: 'some_widget', // Invalid
      col: 1,
      row: 1,
      width: 12,
      height: 6,
    };

    const wrapper = mount((
      <Widget config={config} component={widgets[config.type]} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Grid.Item).exists()).toBe(false);
  });
});
