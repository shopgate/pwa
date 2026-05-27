import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import Lists from '../Lists';

jest.mock('@shopgate/engage/components');

const propertiesNoSubs = [
  {
    name: 'test1',
    label: 'Test 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
  },
];

const propertiesSubs = [
  {
    name: 'test1',
    label: 'Test 1',
    subDisplayGroup: 'Test 1',
  },
  {
    name: 'test2',
    label: 'Test 2',
    subDisplayGroup: 'Test 2',
  },
];

describe('<Lists />', () => {
  it('should only render simple rows', () => {
    const { container } = render(<table><tbody><Lists key="1" properties={propertiesNoSubs} /></tbody></table>);
    expect(container.querySelectorAll('tr')).toHaveLength(2);
    expect(container.querySelectorAll('td[colspan="2"]')).toHaveLength(0);
    expect(screen.getByText('Test 1')).toBeTruthy();
    expect(screen.getByText('Test 2')).toBeTruthy();
  });

  it('should render groups only', () => {
    const { container } = render(<table><tbody><Lists key="2" properties={propertiesSubs} /></tbody></table>);
    expect(container.querySelectorAll('tr')).toHaveLength(4);
    expect(container.querySelectorAll('td[colspan="2"]')).toHaveLength(2);
    expect(screen.getAllByText('Test 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test 2').length).toBeGreaterThan(0);
  });
});
