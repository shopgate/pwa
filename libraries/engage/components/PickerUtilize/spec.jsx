import React from 'react';
import { render } from '@testing-library/react';
import Picker from './index';

jest.mock('@shopgate/engage/components/View');
jest.mock('@shopgate/engage/components', () => {
  function SheetList({ children }) { return children; }
  SheetList.Item = function Item() { return null; };

  return {
    SheetList,
    Sheet: ({ children }) => children,
    Picker: jest.requireActual('@shopgate/engage/components/Picker').default,
    ConnectedReactPortal: jest.requireActual('@shopgate/engage/components/ConnectedReactPortal/__mocks__').default,
  };
});

describe('<Picker />', () => {
  it('should render the picker', () => {
    const label = 'Picker label';
    const wrapper = render(<Picker label={label} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
