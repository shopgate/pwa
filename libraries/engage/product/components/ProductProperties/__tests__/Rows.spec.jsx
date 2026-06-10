import React from 'react';
import { render, screen, within } from '@testing-library/react';
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

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);

    rows.forEach((row, index) => {
      expect(within(row).getByText(properties[index].label)).toBeTruthy();
      expect(within(row).getByText(properties[index].value)).toBeTruthy();
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
