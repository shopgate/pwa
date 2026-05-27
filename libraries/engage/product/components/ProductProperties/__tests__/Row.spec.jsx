import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import Row from '../Row';

describe('<Row />', () => {
  it('should render as expected', () => {
    const { container } = render(<table><tbody><Row label="TestLabel" value="TestValue" /></tbody></table>);
    const cells = container.querySelectorAll('td');
    expect(cells[0].textContent).toEqual('TestLabel');
    expect(cells[1].textContent).toEqual('TestValue');
    expect(screen.getByLabelText('TestLabel: TestValue')).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });
});
