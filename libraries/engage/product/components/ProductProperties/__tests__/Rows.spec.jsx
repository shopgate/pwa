import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import Rows from '../Rows';

jest.mock('@shopgate/engage/components');

const properties = [
  {
    label: 'test1',
    value: '123',
  },
  {
    label: 'test2',
    value: '456',
  },
  {
    label: 'test3',
    value: '789',
  },
];

describe('<Rows />', () => {
  it('should render three rows of properties', () => {
    const { container } = render(<table><tbody><Rows properties={properties} /></tbody></table>);
    expect(container.querySelectorAll('tr')).toHaveLength(3);
    expect(screen.getByText('test1')).toBeTruthy();
    expect(screen.getByText('123')).toBeTruthy();
    expect(screen.getByText('test2')).toBeTruthy();
    expect(screen.getByText('456')).toBeTruthy();
    expect(screen.getByText('test3')).toBeTruthy();
    expect(screen.getByText('789')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });
});
