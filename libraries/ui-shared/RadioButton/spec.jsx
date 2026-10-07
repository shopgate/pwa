import { render, screen } from '@testing-library/react';
import RadioButton from './index';

jest.mock('../icons/RadioCheckedIcon', () => () => 'checked-icon');
jest.mock('../icons/RadioUncheckedIcon', () => () => 'unchecked-icon');

describe('RadioButton', () => {
  it('should render selected RadioButton', () => {
    render(<RadioButton checked />);

    const radio = screen.getByRole('checkbox');

    expect(radio).toBeChecked();
    expect(radio).toHaveTextContent('checked-icon');
    expect(screen.queryByText('unchecked-icon')).not.toBeInTheDocument();
  });

  it('should render unselected RadioButton', () => {
    render(<RadioButton />);

    const radio = screen.getByRole('checkbox');

    expect(radio).not.toHaveAttribute('aria-checked', 'true');
    expect(radio).toHaveTextContent('unchecked-icon');
    expect(screen.queryByText('checked-icon')).not.toBeInTheDocument();
  });
});
