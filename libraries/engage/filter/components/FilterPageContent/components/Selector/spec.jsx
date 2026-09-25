import React from 'react';
import { render } from '@testing-library/react';
import Selector from './index';

jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: () => false,
  i18n: {
    text: string => string,
  },
}));
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/filter', () => ({
  FilterItem: ({ children }) => children,
}));

const values = [
  {
    id: 'foo',
    label: 'fooLabel',
  },
  {
    id: 'bar',
    label: 'barLabel',
  },
];

describe('Filter: <Selector />', () => {
  it('should render with minimum props', () => {
    const wrapper = render(<Selector id="foo" label="bar" values={values} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
