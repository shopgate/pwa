import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Row from '../Row';

describe('<Row />', () => {
  it('should render as expected', () => {
    const { container } = render(<table><tbody><Row label="TestLabel" value="TestValue" /></tbody></table>);

    const [row] = screen.getAllByRole('row');
    expect(within(row).getByText('TestLabel')).toBeTruthy();
    expect(within(row).getByText('TestValue')).toBeTruthy();

    expect(screen.getByLabelText('TestLabel: TestValue')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });
});
