import React from 'react';
import { mount } from 'enzyme';
import Picker from './index';

jest.mock('@shopgate/engage/components/View');
jest.mock('@shopgate/engage/components', () => {
  // eslint-disable-next-line require-jsdoc
  function SheetList({ children }) { return children; }
  SheetList.Item = function Item() { return null; };

  return {
    SheetList,
    Sheet: ({ children }) => children,
    Picker: require.requireActual('@shopgate/engage/components/Picker').default,
  };
});

describe('<Picker />', () => {
  it('should render the picker', () => {
    const label = 'Picker label';
    const wrapper = mount(<Picker label={label} />);
    expect(wrapper).toMatchSnapshot();
  });
});
