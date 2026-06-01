import React from 'react';
import { render, screen } from '@testing-library/react';
import Group from '../Group';

describe('<Group />', () => {
  it('should render a group title row', () => {
    const { container } = render(<table><tbody><Group group="Test" /></tbody></table>);
    expect(container.querySelectorAll('tr')).toHaveLength(1);
    expect(container.querySelectorAll('td')).toHaveLength(1);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
